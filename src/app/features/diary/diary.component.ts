import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TableDataComponent } from '../../shared/components/table-data/table-data.component';
import { SidePanelService } from '../../shared/services/side-panel/side-panel.service';
import { MealsComponent } from '../meals/meals.component';
import { SidePanelComponent } from '../../shared/components/side-panel/side-panel.component';
import { DiaryService } from '../../core/services/diary/diary.service';
import { withGlobalAppSpinner } from '../../shared/utils/with-global-spinner';
import { SpinnerService } from '../../shared/services/spinner/spinner-service.service';
import { AddEditMealComponent } from '../meals/add-edit-meal/add-edit-meal.component';
import { diaryMealColumns, exercisesColumns } from '../../core/const/diary/diary.const';
import { DiaryMeal } from '../../core/models/meals/meal.interface';
import { AddEdit } from '../../core/enums/add-edit/add-edit.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  ],
  templateUrl: './diary.component.html',
  styleUrl: './diary.component.scss',
})
export class DiaryComponent implements OnInit {
  private readonly sidePanelService = inject(SidePanelService);
  private readonly diaryService = inject(DiaryService);
  private readonly spinnerService = inject(SpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  diary!: Diary;
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
  exercisesColumns = exercisesColumns(this.editExercise.bind(this), this.deleteExercise.bind(this));

  ngOnInit(): void {
    this.getDailyDiary();
    
    this.sidePanelService.onCloseSidePanel().subscribe((response) => {
      if (response) {
        this.getDailyDiary();
      }
    })
  }

  private getDailyDiary(): void {
    this.diaryService
      .getDiaryByDay(this.day)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withGlobalAppSpinner(this.spinnerService, 'Loading diary...'))
      .subscribe((response) => {
        this.diary = response.data;

        for (let m of this.meals) {
          m.columns = [
            ...diaryMealColumns(
              { id: m.meal, label: m.meal },
              this.editMeal.bind(this),
              this.deleteMeal.bind(this)
            ),
          ];

          if (response.data?.[m.meal]) {
            const meal = response.data[m.meal].map((item: any) => ({
              _id: item._id,
              name: item.name,
              quantity: item.quantity,
              measurementUnit: 'g',
              calories: item.nutritients.calories,
              mealType: item.mealType,
              diary: item.diary,
              ...item.nutritients,
            }));

            let caloriesLabel = m.columns.find(
              (item: any) => item.id === 'calories'
            )!;

            caloriesLabel.label = meal.reduce(
              (sum: any, item: any) => sum + item.calories,
              0
            );

            m.data = [...meal];
          }
        }

        this.exercises = response.data.exercisesGroup;
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
    this.sidePanelService
      .openSidePanel(MealsComponent, {
        data: { day: this.day, mealType: mealType, diary: this.diary },
        pageTitle: mealType,
      })
  }

  editMeal(row: DiaryMeal): void {
    this.sidePanelService
      .openSidePanel(AddEditMealComponent, {
        data: { meal: row, day: this.day, mealType: row.mealType, mode: AddEdit.EDIT },
        pageTitle: row.mealType,
      })
  }

  deleteMeal(row: DiaryMeal): void {
    this.diaryService.deleteDiaryMeal(row._id!).subscribe((res) => {
      this.getDailyDiary();
    });
  }

  editExercise(row: any): void {
    console.log(row);
  }

  deleteExercise(row: any): void {
    console.log(row);
  }
}
