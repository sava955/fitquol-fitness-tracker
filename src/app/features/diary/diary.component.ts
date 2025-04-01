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
import { withGlobalAppSpinner } from '../../shared/utils/with-global-spinner';
import { SpinnerService } from '../../shared/services/spinner/spinner-service.service';
import { AddEditMealComponent } from '../meals/add-edit-meal/add-edit-meal.component';
import {
  diaryMealColumns,
  diaryExercisesColumns,
} from '../../core/const/diary/diary.const';
import { AddEdit } from '../../core/enums/add-edit/add-edit.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ExercisesComponent } from '../exercises/exercises.component';
import { AddEditExerciseComponent } from '../exercises/add-edit-exercise/add-edit-exercise.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { NutrientsComponent } from '../../shared/components/nutrients/nutrients.component';
import { Meal } from '../../core/models/meals/meal.interface';
import { Diary } from '../../core/models/diary/diary';

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
    NutrientsComponent
  ],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
})
export class DiaryComponent implements OnInit {
  private readonly sidePanelService = inject(SidePanelService);
  private readonly diaryService = inject(DiaryService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  diary!: any
  day = new Date();

  meals: any[] = [
    {
      meal: 'breakfast',
      columns: [],
      data: [],
    },
    { meal: 'lunch', columns: [], data: [] },
    { meal: 'dinner', columns: [], data: [] },
    { meal: 'snacks', columns: [], data: [] },
  ];

  exercises = [];
  exercisesColumns = diaryExercisesColumns(
    this.editExercise.bind(this),
    this.deleteExercise.bind(this)
  );

  ngOnInit(): void {
    this.getDailyDiary();

    this.sidePanelService.onCloseSidePanel().subscribe((response) => {
      if (response) {
        this.getDailyDiary();
      }
    });
  }

  private getDailyDiary(): void {
    this.diaryService
      .getDiaryByDay(this.day)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withGlobalAppSpinner(this.spinnerService, 'Loading diary...')
      )
      .subscribe((response) => {
        this.diary = response.data;

        for (let m of this.meals) {
          m.columns = [
            ...diaryMealColumns(
              { id: m.meal, label: m.meal },
              this.editMeal.bind(this),
              this.deleteMeal.bind(this),
              
            ),
          ];

          if (response.data?.[m.meal]) {
            const meal = response.data[m.meal].map((item: Meal) => ({
              ...item,
              calories: item.nutrients.calories
            }));

            let caloriesLabel = m.columns.find(
              (item: any) => item.id === 'calories'
            )!;

            caloriesLabel.label = meal.reduce(
              (sum: any, item: any) => sum + item.nutrients.calories,
              0
            );

            m.data = [...meal];
          }
        }

        this.exercises = response.data.exercises.map((exercise: any) => ({
          name: exercise.exercise.category,
          description: exercise.exercise.description,
          ...exercise,
        }));
      });
  }

  getNextDay(): void {
    this.day = new Date(this.day);
    this.day.setDate(this.day.getDate() + 1);

    this.getDailyDiary();
  }

  getPreviousDay(): void {
    this.day = new Date(this.day);
    this.day.setDate(this.day.getDate() - 1);

    this.getDailyDiary();
  }

  addMeal(mealType: string): void {
    this.sidePanelService.openSidePanel(MealsComponent, {
      data: { day: this.day, mealType: mealType, diary: this.diary },
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

  editExercise(row: any): void {
    this.sidePanelService.openSidePanel(AddEditExerciseComponent, {
      data: { exercise: row, day: this.day, mode: AddEdit.EDIT },
      pageTitle: 'Update exercise',
    });
  }

  deleteExercise(row: any): void {
    this.diaryService.deleteDiaryExercise(row._id).subscribe((response) => {
      this.getDailyDiary();
    });
  }
}
