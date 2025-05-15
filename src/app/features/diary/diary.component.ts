import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TableDataComponent } from '../../shared/components/table-data/table-data.component';
import { SidePanelService } from '../../core/services/side-panel/side-panel.service';
import { MealsComponent } from './components/meals/meals.component';
import { SidePanelComponent } from '../../shared/components/side-panel/side-panel.component';
import { DiaryService } from './services/diary.service';
import { AddEditMealComponent } from './components/meals/add-edit-meal/add-edit-meal.component';
import {
  diaryMealColumns,
  diaryExercisesColumns,
} from './const/diary.const';
import { AddEdit } from '../../core/enums/add-edit.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { AddEditExerciseComponent } from './components/exercises/add-edit-exercise/add-edit-exercise.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NutrientsComponent } from '../../shared/components/nutrients/nutrients.component';
import { Meal } from './models/meal.interface';
import { LocalSpinnerComponent } from '../../shared/components/local-spinner/local-spinner.component';
import { LocalSpinnerService } from '../../core/services/local-spinner/local-spinner.service';
import { withLocalAppSpinner } from '../../core/utils/with-local-spinner';
import { Diary, MealKey } from './models/diary.interface';
import { DiaryExercise } from './models/exercise.interface';
import { Column } from '../../core/models/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal } from '../../core/models/goal';
import { CaloriesBalanceComponent } from './components/calories-balance/calories-balance.component';
import { DateControllerCardComponent } from './components/date-controler-card/date-controller-card.component';
import { filter, map, merge, Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-diary',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    TableDataComponent,
    SidePanelComponent,
    MatIcon,
    MatExpansionModule,
    NutrientsComponent,
    LocalSpinnerComponent,
    MatDatepickerModule,
    ReactiveFormsModule,
    DateControllerCardComponent,
    CaloriesBalanceComponent,
  ],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class DiaryComponent implements OnInit {
  private readonly sidePanelService = inject(SidePanelService);
  private readonly diaryService = inject(DiaryService);
  private readonly spinnerService = inject(LocalSpinnerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  diary: Diary | null = null;

  day = new Date();
  startDate!: Date;

  meals: {
    meal: MealKey;
    data: Meal[];
    columns: Column<Meal>[];
  }[] = [];

  exercises: DiaryExercise[] = [];
  exercisesColumns = diaryExercisesColumns(
    this.editExercise.bind(this),
    this.deleteExercise.bind(this)
  );

  nutrients: Goal | null = null;

  ngOnInit(): void {
    const queryParams$ = this.route.queryParamMap.pipe(
      map((params) => params.get('day')),
      tap((date) => {
        if (date) this.day = new Date(date);
      })
    );

    const panelClosed$ = this.sidePanelService
      .onCloseSidePanel()
      .pipe(filter(Boolean));

    merge(queryParams$, panelClosed$)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.getDailyDiary())
      )
      .subscribe();
  }

  setDayParams(event: Date): void {
    const year = event.getFullYear();
    const month = String(event.getMonth() + 1).padStart(2, '0');
    const day = String(event.getDate()).padStart(2, '0');
    const formattedDay = `${year}-${month}-${day}`;
    this.router.navigate(['diary'], { queryParams: { day: formattedDay } });
  }

  private getDailyDiary(): Observable<Diary> {
    return this.diaryService.getOne({ day: this.day.toISOString() }).pipe(
      withLocalAppSpinner(this.spinnerService),
      map((response) => response.data as Diary),
      tap((diary: Diary) => {
        this.diary = diary;
        this.startDate = new Date(diary.startDate);
        this.handleDiaryMeals();
        this.handleDiaryExercises();
      })
    );
  }

  private handleDiaryMeals(): void {
    const mealKeys = Object.keys(this.diary || {}).filter((key) =>
      ['breakfast', 'lunch', 'dinner', 'snacks'].includes(key)
    ) as MealKey[];

    this.meals = mealKeys.map((mealKey) => {
      const items: Meal[] = (this.diary?.[mealKey] ?? []).map((item: Meal) => ({
        ...item,
        quantity: Math.round(item.quantity),
        calories: Math.round(item.nutrients.calories),
      }));

      const columns = diaryMealColumns(
        { id: mealKey, label: mealKey },
        this.editMeal.bind(this),
        this.deleteMeal.bind(this)
      );

      const totalCalories = items.reduce(
        (sum, item) => sum + item.nutrients.calories,
        0
      );
      const caloriesCol = columns.find((col) => col.id === 'calories');
      if (caloriesCol) caloriesCol.label = String(totalCalories);

      return {
        meal: mealKey,
        data: items,
        columns,
      };
    });
  }

  private handleDiaryExercises(): void {
    const exercises = this.diary?.exercises ?? [];

    const totalCalories = exercises.reduce(
      (sum, item) => sum + Math.round(item.caloriesBurned),
      0
    );

    const caloriesCol = this.exercisesColumns.find(
      (col) => col.id === 'calories'
    );
    if (caloriesCol) caloriesCol.label = String(totalCalories);

    this.exercises = exercises.map((exercise) => ({
      name: exercise.exercise.category,
      description: exercise.exercise.description,
      calories: exercise.caloriesBurned,
      ...exercise,
    }));
  }

  addMeal(mealType: MealKey): void {
    this.sidePanelService.openSidePanel(MealsComponent, {
      day: this.day,
      mealType,
      pageTitle: mealType,
    });
  }

  editMeal(meal: Meal): void {
    this.sidePanelService.openSidePanel(AddEditMealComponent, {
      meal,
      day: this.day,
      mealType: meal.mealType,
      mode: AddEdit.EDIT,
      pageTitle: meal.mealType,
    });
  }

  deleteMeal(meal: Meal): void {
    this.deleteDiaryItem(meal._id!, 'meal');
  }

  addExercises(): void {
    this.sidePanelService.openSidePanel(ExercisesComponent, {
      day: this.day,
      pageTitle: 'Add exercise',
    });
  }

  editExercise(exercise: DiaryExercise): void {
    this.sidePanelService.openSidePanel(AddEditExerciseComponent, {
      exercise,
      day: this.day,
      mode: AddEdit.EDIT,
      pageTitle: 'Update exercise',
    });
  }

  deleteExercise(exercise: DiaryExercise): void {
    this.deleteDiaryItem(exercise._id!, 'exercise');
  }

  deleteDiaryItem(id: string, path: string): void {
    this.diaryService
      .delete(id, path)
      .pipe(switchMap(() => this.getDailyDiary()))
      .subscribe();
  }
}
