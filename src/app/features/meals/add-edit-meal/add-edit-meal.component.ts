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
import { Meal, NutrientData, Nutrients } from '../../../core/models/meals/meal.interface';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NutrientsComponent } from '../../../shared/components/nutrients/nutrients.component';

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
    MatExpansionModule,
    PageTitleComponent,
    MatCheckboxModule,
    NutrientsComponent,
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

  meal!: Meal;
  currentQuantity!: number;
  errorMessage!: string;

  nutrients!: Nutrients;

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
      this.nutrients = {
        calories: this.meal.nutrients.calories,
        macronutrients: [...this.meal.nutrients.macronutrients],
        micronutrients: [...this.meal.nutrients.micronutrients],
      };

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
        this.calculateNutritientsForQuantity(Number(value));

        this.chartOptions.labels = [
          `Carbs ${this.nutrients.macronutrients.find((nutrient: NutrientData) => nutrient.key === 'carbohydrates')?.value}g`,
          `Protein ${this.nutrients.macronutrients.find((nutrient: NutrientData) => nutrient.key === 'protein')?.value}g`,
          `Fat ${this.nutrients.macronutrients.find((nutrient: NutrientData) => nutrient.key === 'fats')?.value}g`,
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
        this.nutrients = {
          calories: this.meal.nutrients.calories,
          macronutrients: [...this.meal.nutrients.macronutrients],
          micronutrients: [...this.meal.nutrients.micronutrients],
        };
        this.setChart();
      });
  }

  private setChart(): void {
    const carbohydrates =
      this.meal.nutrients.macronutrients.find(
        (d: NutrientData) => d.key === 'carbohydrates'
      )?.value ?? 0;
      const protein =
      this.meal.nutrients.macronutrients.find((d: NutrientData) => d.key === 'protein')
        ?.value ?? 0;
        const fats =
      this.meal.nutrients.macronutrients.find((d: NutrientData) => d.key === 'fats')
        ?.value ?? 0;

    this.chartOptions = {
      series: [carbohydrates, protein, fats],
      chart: {
        type: 'pie',
        animations: {
          enabled: false,
        },
      },
      labels: [
        `Carbs ${carbohydrates}g`,
        `Protein ${protein}g`,
        `Fat ${fats}g`,
      ],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 350,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  calculateNutritientsForQuantity(quantity: number) {
    if (quantity == 0) {
      return;
    }

    this.nutrients.calories = Number(
      ((this.meal.nutrients.calories * quantity) / this.meal.quantity).toFixed(0)
    );

    this.meal.nutrients.macronutrients.forEach((macronutrient: NutrientData) => {
      const baseValue = macronutrient.value / this.meal.quantity;

      const value = parseFloat((baseValue * quantity).toFixed(2));

      const dailyLimit = macronutrient.dailyLimit;

      const percentageOfTotal =
        dailyLimit > 0
          ? parseFloat(((value / dailyLimit) * 100).toFixed(0))
          : 0;

      let macronutrientIndex = this.nutrients.macronutrients.findIndex(
        (nutrient: NutrientData) => nutrient.key === macronutrient.key
      );
      this.nutrients.macronutrients[macronutrientIndex] = {
        ...this.nutrients.macronutrients[macronutrientIndex],
        value: value,
        percentageOfTotal: percentageOfTotal,
      };
    });

    this.meal.nutrients.micronutrients.forEach((micronutrient: NutrientData) => {
      const baseValue = micronutrient.value / this.meal.quantity;

      const value = parseFloat((baseValue * quantity).toFixed(2));

      const dailyLimit = micronutrient.dailyLimit;

      const percentageOfTotal =
        dailyLimit > 0
          ? parseFloat(((value / dailyLimit) * 100).toFixed(0))
          : 0;

      let micronutrientIndex = this.nutrients.micronutrients.findIndex(
        (nutrient: NutrientData) => nutrient.key === micronutrient.key
      );
      this.nutrients.micronutrients[micronutrientIndex] = {
        ...this.nutrients.micronutrients[micronutrientIndex],
        value: value,
        percentageOfTotal: percentageOfTotal,
      };
    });
  }

  addMeal(): void {
    const data = this.mealForm.value;

    const meal: Meal = {
      name: this.meal.name,
      quantity: data.quantity!,
      measurementUnit: 'g',
      nutrients: {
        ...this.nutrients
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

    const meal: Meal = {
      name: this.meal.name,
      quantity: data.quantity!,
      measurementUnit: 'g',
      nutrients: {
        ...this.nutrients
      },
      day: this.day,
      mealType: data.mealType!,
    };

    this.diaryService
      .updateMeal(this.meal._id!, meal)
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
