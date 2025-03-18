import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { MealsService } from '../../../core/services/meals/meals.service';
import { DiaryService } from '../../../core/services/diary/diary.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidePanelService } from '../../../shared/services/side-panel/side-panel.service';
import { ActionButtons } from '../../../core/models/action-buttons/action.buttons.interface';
import { CommonModule } from '@angular/common';
import { FormBaseComponent } from '../../../shared/components/form-base/form-base.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MatIcon } from '@angular/material/icon';
import {
  DiaryMeal,
  Meal,
  Nutritients,
} from '../../../core/models/meals/meal.interface';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-add-meal',
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormBaseComponent,
    MatButtonModule,
    MatFormField,
    MatSelect,
    MatLabel,
    MatInputModule,
    MatOption,
    InputBaseComponent,
    ReactiveFormsModule,
    MatIcon,
  ],
  templateUrl: './add-edit-meal.component.html',
  styleUrl: './add-edit-meal.component.scss',
})
export class AddEditMealComponent {
  private readonly mealsService = inject(MealsService);
  private readonly diaryService = inject(DiaryService);
  private readonly fb = inject(FormBuilder);
  private readonly sidePanelService = inject(SidePanelService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  mealOptions = ['breakfast', 'lunch', 'dinner', 'snacks'];

  carbohydrates!: number;
  protein!: number;
  fat!: number;
  calories!: number;

  mealForm = this.fb.group({
    quantity: [100, [Validators.required, Validators.max(999)]],
    mealType: [null, Validators.required],
  });

  id =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.id;
  day =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.day;
  mealType =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.mealType;
  mode =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.mode;

  diary =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.diary;

  meal: any;
  errorMessage!: string;

  actionBtns: ActionButtons[] = [
    {
      label: 'Cancel',
      action: () => {
        this.sidePanelService.closeTopComponent();
      },
      style: 'secondary',
    },
    {
      label: this.mode === AddEdit.ADD ? 'Add meal' : 'Update meal',
      action: () => {
        this.mode === AddEdit.ADD ? this.addMeal() : this.updateMeal();
      },
    },
  ];

  get quantity() {
    return this.mealForm.get('quantity');
  }

  constructor() {
    this.chartOptions = {};
  }

  ngOnInit(): void {
    if (this.mode && this.mode === AddEdit.EDIT) {
      this.meal =
        this.sidePanelService.drawerStack()[
          this.sidePanelService.drawerStack().length - 1
        ]?.data.data?.meal;

      this.mealForm.get('quantity')?.setValue(this.meal.quantity);

      this.setChart();
    } else {
      this.getMeal();
    }

    this.mealForm.get('mealType')?.setValue(this.mealType.toUpperCase());
    this.onFormEvent();
  }

  private onFormEvent(): void {
    this.quantity?.valueChanges.subscribe((value) => {
      if (value) {
        this.calories = this.calculateNutritionForQuantity(value).calories;
        this.carbohydrates =
          this.calculateNutritionForQuantity(value).carbohydrates;
        this.protein = this.calculateNutritionForQuantity(value).protein;
        this.fat = this.calculateNutritionForQuantity(value).fat;

        this.chartOptions.labels = [
          `Carbs ${this.carbohydrates}g`,
          `Protein ${this.protein}g`,
          `Fat ${this.fat}g`,
        ];
      }
    });
  }

  private getMeal(): void {
    this.mealsService
      .getMeal(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res: Meal) => {
        this.meal = res;
        this.setChart();
      });
  }

  private setChart(): void {
    this.carbohydrates = this.meal.carbohydrates;
    this.protein = this.meal.protein;
    this.fat = this.meal.fat;
    this.calories = this.meal.calories;

    this.chartOptions = {
      series: [this.meal.carbohydrates, this.meal.protein, this.meal.fat],
      chart: {
        type: 'pie',
        animations: {
          enabled: false
        }
      },
      labels: [
        `Carbs ${this.carbohydrates}g`,
        `Protein ${this.protein}g`,
        `Fat ${this.fat}g`,
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  calculateNutritionForQuantity(quantity: number): Nutritients {
    if (this.mode === AddEdit.EDIT) {
      return {
        carbohydrates: Number(
          ((this.meal.carbohydrates * quantity) / this.meal.quantity
        ).toFixed(0)),
        protein: Number(((this.meal.protein * quantity) / this.meal.quantity).toFixed(0)),
        fat: Number(((this.meal.fat * quantity) / this.meal.quantity).toFixed(0)),
        calories: Number(((this.meal.calories * quantity) / this.meal.quantity).toFixed(0)),
      };
    }

    return {
      carbohydrates: Number(((this.meal.carbohydrates * quantity) / 100).toFixed(0)),
      protein: Number(((this.meal.protein * quantity) / 100).toFixed(0)),
      fat: Number(((this.meal.fat * quantity) / 100).toFixed(0)),
      calories: Number(((this.meal.calories * quantity) / 100).toFixed(0)),
    };
  }

  addMeal(): void {
    const data = this.mealForm.value;

    const meal: DiaryMeal = {
      name: this.meal.name,
      quantity: data.quantity!,
      measurementUnit: 'g',
      nutritients: {
        calories: this.calories,
        carbohydrates: this.carbohydrates,
        protein: this.protein,
        fat: this.fat,
      },
      day: this.day,
      mealType: data.mealType!,
    };

    this.diaryService
      .addMeal(meal)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.sidePanelService.closeTopComponent(res.success);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
  }

  updateMeal(): void {
    const data = this.mealForm.value;

    const meal: DiaryMeal = {
      name: this.meal.name,
      quantity: data.quantity!,
      measurementUnit: 'g',
      nutritients: {
        calories: this.calories,
        carbohydrates: this.carbohydrates,
        protein: this.protein,
        fat: this.fat,
      },
      day: this.day,
      mealType: data.mealType!,
      diary: this.meal.diary,
    };

    this.diaryService
      .updateMeal(this.meal._id, meal)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.sidePanelService.closeTopComponent(res.success);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
  }

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
