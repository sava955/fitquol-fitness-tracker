import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { DiaryService } from '../../../core/services/diary/diary.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SidePanelService } from '../../../shared/services/side-panel/side-panel.service';
import { ActionButtons } from '../../../core/models/action-buttons/action.buttons.interface';
import { CommonModule } from '@angular/common';
import { FormBaseComponent } from '../../../shared/components/form-base/form-base.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import {
  Meal
} from '../../../core/models/meals/meal.interface';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NutrientsComponent } from '../../../shared/components/nutrients/nutrients.component';
import { calculateNutritientsForQuantity } from '../../../shared/utils/calculate-nutrients-for-quantity';
import { mealTypes } from '../../../core/const/meals/meal-types';
import { SelectBaseComponent } from '../../../shared/components/select-base/select-base.component';
import { SelectOptions } from '../../../core/models/select-base/selet-options.interface';
import { SidePanelComponent } from '../../../shared/components/side-panel/side-panel.component';
import { Recipe } from '../../../core/models/recipes/recipes.interface';
import { RepiceDetailsComponent } from '../../recipes/repice-details/repice-details.component';
import { NutrientData, Nutrients } from '../../../core/models/nutrients/nutrient.interface';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: string[];
};

@Component({
  selector: 'app-add-meal',
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormBaseComponent,
    MatButtonModule,
    MatInputModule,
    InputBaseComponent,
    ReactiveFormsModule,
    MatExpansionModule,
    PageTitleComponent,
    MatCheckboxModule,
    NutrientsComponent,
    SelectBaseComponent,
    SidePanelComponent
  ],
  templateUrl: './add-edit-meal.component.html',
  styleUrl: './add-edit-meal.component.scss',
})
export class AddEditMealComponent {
  private readonly diaryService = inject(DiaryService);
  private readonly fb = inject(FormBuilder);
  private readonly sidePanelService = inject(SidePanelService);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  mealForm = this.fb.group({
    served: [1, [Validators.required, Validators.min(1)]],
    quantity: [100, [Validators.required, Validators.max(999)]],
    mealType: [null, Validators.required],
  });

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

  meal!: Meal;
  currentQuantity!: number;
  errorMessage!: string;

  nutrients!: Nutrients;

  mealOptions = mealTypes;
  servingsOptions: SelectOptions[] = [];

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
        this.onSubmit();
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
    this.meal =
      this.sidePanelService.drawerStack()[
        this.sidePanelService.drawerStack().length - 1
      ]?.data.data?.meal;

    if (this.meal.servings) {
      for (let i = 0; i < this.meal.servings; i++) {
        this.servingsOptions.push({
          label: (i + 1).toFixed(),
          value: i + 1
        });
      }
    }

    this.nutrients = calculateNutritientsForQuantity(
      this.meal,
      this.meal.quantity
    )!;

    if (this.meal.recipe) {
      this.mealForm.get('served')?.setValue(1);
    }
    this.mealForm.get('quantity')?.setValue(this.meal.quantity);
    this.mealForm.get('mealType')?.setValue(this.mealType.toUpperCase());

    this.setChart();
    this.onFormEvent();
  }

  private onFormEvent(): void {
    this.mealForm.get('served')?.valueChanges.subscribe((value) => {
      const newValue = Number(value);
      const quantity = this.meal.quantity * newValue;
      this.quantity?.setValue(quantity);
    });

    this.quantity?.valueChanges.subscribe((value) => {
      const quantity = Number(value);
      if (quantity > 0) {
        this.nutrients = calculateNutritientsForQuantity(
          this.meal,
          quantity
        )!;

        this.chartOptions.labels = [
          `Carbs ${
            this.nutrients.macronutrients.find(
              (nutrient: NutrientData) => nutrient.key === 'carbohydrates'
            )?.value.toFixed(2)
          }g`,
          `Protein ${
            this.nutrients.macronutrients.find(
              (nutrient: NutrientData) => nutrient.key === 'protein'
            )?.value.toFixed(2)
          }g`,
          `Fat ${
            this.nutrients.macronutrients.find(
              (nutrient: NutrientData) => nutrient.key === 'fats'
            )?.value.toFixed(2)
          }g`,
        ];
      }
    });
  }

  private setChart(): void {
    const carbohydrates =
      this.meal.nutrients.macronutrients.find(
        (d: NutrientData) => d.key === 'carbohydrates'
      )?.value ?? 0;
    const protein =
      this.meal.nutrients.macronutrients.find(
        (d: NutrientData) => d.key === 'protein'
      )?.value ?? 0;
    const fats =
      this.meal.nutrients.macronutrients.find(
        (d: NutrientData) => d.key === 'fats'
      )?.value ?? 0;

    this.chartOptions = {
      series: [carbohydrates, protein, fats],
      chart: {
        type: 'pie',
        animations: {
          enabled: false,
        },
      },
      labels: [
        `Carbs ${carbohydrates.toFixed(2)}g`,
        `Protein ${protein.toFixed(2)}g`,
        `Fat ${fats.toFixed(2)}g`,
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

  onSubmit(): void {
    const data = this.mealForm.value;

    let meal: Meal = {
      name: this.meal.name,
      quantity: data.quantity!,
      measurementUnit: 'g',
      nutrients: {
        ...this.nutrients,
      },
      day: this.day,
      mealType: data.mealType!,
    };

    if (this.meal.recipe) {
      meal = {
        ...meal,
        recipe: this.meal.recipe,
      };

      if (this.meal.image)
        meal = {
          ...meal,
          image: this.meal.image,
        };

      if (this.meal.servings)
        meal = {
          ...meal,
          servings: this.meal.servings,
          served: data.served!
        };
    }

    const submit =
      this.mode === AddEdit.ADD
        ? this.diaryService.addMeal(meal)
        : this.diaryService.updateMeal(this.meal._id!, meal);

    submit.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

  openRecepeDetails(recipe: Recipe): void {
    this.sidePanelService.openSidePanel(RepiceDetailsComponent, {
      data: {
        recipe: recipe
      },
      pageTitle: recipe.name,
    });
  }
}
