import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TableDataComponent } from '../../shared/components/table-data/table-data.component';
import { SidePanelService } from '../../shared/services/side-panel/side-panel.service';
import { MealsComponent } from '../meals/meals.component';
import { SidePanelComponent } from '../../shared/components/side-panel/side-panel.component';
import { DiaryService } from '../../core/services/diary/diary.service';
import { AddEditMealComponent } from '../meals/add-edit-meal/add-edit-meal.component';
import {
  diaryMealColumns,
  diaryExercisesColumns,
  meals,
} from '../../core/const/diary/diary.const';
import { AddEdit } from '../../core/enums/add-edit/add-edit.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExercisesComponent } from '../exercises/exercises.component';
import { AddEditExerciseComponent } from '../exercises/add-edit-exercise/add-edit-exercise.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NutrientsComponent } from '../../shared/components/nutrients/nutrients.component';
import { Meal } from '../../core/models/meals/meal.interface';
import { LocalSpinnerComponent } from '../../shared/components/local-spinner/local-spinner.component';
import { LocalSpinnerService } from '../../shared/services/local-spinner/local-spinner.service';
import { withLocalAppSpinner } from '../../shared/utils/with-local-spinner';
import { Diary, MealKey } from '../../core/models/diary/diary';
import { DiaryExercise } from '../../core/models/exercises/exercise.interface';
import { Column } from '../../core/models/table/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal } from '../../core/models/goals/goal';
import { getGoalByDate } from '../../shared/utils/get-goal-by-date';

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

  diary!: Diary;

  day = new Date();
  dayCtrl = new FormControl();

  meals = meals;

  exercises: DiaryExercise[] = [];
  exercisesColumns = diaryExercisesColumns(
    this.editExercise.bind(this),
    this.deleteExercise.bind(this)
  );

  dailyCalories!: number;
  
  nutrients!: Goal;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      if (params.get('day')) {
        this.day = params.get('day');
        this.dayCtrl.setValue(this.day);
      }

      this.getDailyDiary();
    });

    this.sidePanelService.onCloseSidePanel().subscribe((response) => {
      if (response) {
        this.getDailyDiary();
      }
    });

    this.dayCtrl.valueChanges.subscribe((value) => {
      if (value) {
        this.day = value;

        this.setDayParams();
      }
    });
  }

  private setDayParams(): void {
    this.router.navigate(['diary'], { queryParams: { day: this.day } });
  }

  private getDailyDiary(): void {
    this.diaryService
      .getDiaryByDay(this.day)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService)
      )
      .subscribe((response) => {
        this.diary = response.data;

        this.nutrients = getGoalByDate(this.diary.user.goals, this.day);

        this.dailyCalories = this.nutrients.caloriesRequired;

        if (!this.dailyCalories) {
          this.dailyCalories = this.diary.user.goals[0].caloriesRequired;
        }

        this.handleDiaryMeals();
        this.handleDiaryExercises();
      });
  }

  private handleDiaryMeals(): void {
    for (let m of this.meals) {
      m.columns = [
        ...diaryMealColumns(
          { id: m.meal, label: m.meal },
          this.editMeal.bind(this),
          this.deleteMeal.bind(this)
        ),
      ];

      if (this.diary[m.meal as MealKey]) {
        const meal = this.diary[m.meal as MealKey].map((item: Meal) => ({
          ...item,
          quantity: Math.round(item.quantity),
          calories: Math.round(item.nutrients.calories),
        }));

        let caloriesLabel = m.columns.find(
          (item: Column<Meal>) => item.id === 'calories'
        )!;

        caloriesLabel.label = String(
          meal.reduce(
            (sum: number, item: Meal) =>
              sum + Math.round(item.nutrients.calories),
            0
          )
        );

        m.data = [...meal];
      }
    }
  }

  private handleDiaryExercises(): void {
    let caloriesLabel = this.exercisesColumns.find(
      (item: Column<DiaryExercise>) => item.id === 'calories'
    )!;

    caloriesLabel.label = String(
      this.diary.exercises.reduce(
        (sum: number, item: DiaryExercise) =>
          sum + Math.round(item.caloriesBurned),
        0
      )
    );

    this.exercises = this.diary.exercises.map((exercise: DiaryExercise) => ({
      name: exercise.exercise.category,
      description: exercise.exercise.description,
      calories: exercise.caloriesBurned,
      ...exercise,
    }));
  }

  getNextDay(): void {
    this.day = new Date(this.day);
    this.day.setDate(this.day.getDate() + 1);

    this.setDayParams();
  }

  getPreviousDay(): void {
    this.day = new Date(this.day);
    this.day.setDate(this.day.getDate() - 1);

    this.setDayParams();
  }

  addMeal(mealType: string): void {
    this.sidePanelService.openSidePanel(MealsComponent, {
      data: {
        day: this.day,
        mealType: mealType,
        diary: this.diary,
      },
      pageTitle: mealType,
    });
  }

  editMeal(row: Meal): void {
    this.sidePanelService.openSidePanel(AddEditMealComponent, {
      data: {
        meal: row,
        day: this.day,
        mealType: row.mealType,
        mode: AddEdit.EDIT,
      },
      pageTitle: row.mealType,
    });
  }

  deleteMeal(row: Meal): void {
    this.diaryService.deleteDiaryMeal(row._id!).subscribe((res) => {
      this.getDailyDiary();
    });
  }

  addExercises(): void {
    this.sidePanelService.openSidePanel(ExercisesComponent, {
      data: { day: this.day, diary: this.diary },
      pageTitle: 'Add exercise',
    });
  }

  editExercise(row: DiaryExercise): void {
    this.sidePanelService.openSidePanel(AddEditExerciseComponent, {
      data: { exercise: row, day: this.day, mode: AddEdit.EDIT },
      pageTitle: 'Update exercise',
    });
  }

  deleteExercise(row: DiaryExercise): void {
    this.diaryService.deleteDiaryExercise(row._id!).subscribe((_) => {
      this.getDailyDiary();
    });
  }
}
