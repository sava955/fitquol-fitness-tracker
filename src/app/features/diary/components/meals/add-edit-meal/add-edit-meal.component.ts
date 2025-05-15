import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ActionButtons } from '../../../../../core/models/action.buttons.interface';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../../../../shared/components/form/form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { Meal } from '../../../models/meal.interface';
import { AddEdit } from '../../../../../core/enums/add-edit.enum';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { NutrientsComponent } from '../../../../../shared/components/nutrients/nutrients.component';
import { calculateNutritientsForQuantity } from '../../../../../core/utils/calculate-nutrients-for-quantity';
import { mealTypes } from '../../../const/meal-types.const';
import { SelectComponent } from '../../../../../shared/components/select/select.component';
import { SelectOptions } from '../../../../../core/models/selet-options.interface';
import { SidePanelComponent } from '../../../../../shared/components/side-panel/side-panel.component';
import { RecipeDetailsComponent } from '../../../../recipes/components/recipe-details/recipe-details.component';
import {
  NutrientData,
  Nutrients,
} from '../../../../../core/models/nutrient.interface';
import { FormBaseComponent } from '../../../../../shared/components/form-base/form-base.component';
import { map, Observable } from 'rxjs';
import { ResponseObj } from '../../../../../core/models/http-response.interface';
import { mealActionButtons } from '../../../const/meals.const.const';
import { DiaryService } from '../../../services/diary.service';
import { Recipe } from '../../../../recipes/models/recipe.interface';
import { MacrosChartComponent } from '../../../../../shared/components/macros-chart/macros-chart.component';
import { recipeMealResponsiveChart } from '../../../../../core/const/recipe-meal-responsive-chart';

@Component({
  selector: 'app-add-meal',
  imports: [
    CommonModule,
    FormComponent,
    MatButtonModule,
    MatInputModule,
    InputComponent,
    ReactiveFormsModule,
    PageTitleComponent,
    NutrientsComponent,
    SelectComponent,
    SidePanelComponent,
    MacrosChartComponent,
  ],
  templateUrl: './add-edit-meal.component.html',
  styleUrl: './add-edit-meal.component.scss'
})
export class AddEditMealComponent extends FormBaseComponent<Meal> {
  private readonly diaryService = inject(DiaryService);

  day!: Date;
  mealType!: string;

  meal!: Meal;
  currentQuantity!: number;

  nutrients!: Nutrients;

  mealOptions = mealTypes;
  servingsOptions: SelectOptions[] = [];

  responsive = recipeMealResponsiveChart;

  get quantity() {
    return this.formGroup.get('quantity');
  }

  protected override setActionButtons(): ActionButtons[] {
    return mealActionButtons(
      this.goBack.bind(this),
      this.onSubmit.bind(this),
      this.mode
    );
  }

  protected override buildForm(): void {
    this.formGroup = this.fb.group({
      served: [1, [Validators.required, Validators.min(1)]],
      quantity: [100, [Validators.required, Validators.max(999)]],
      mealType: ['', Validators.required],
    });

    if (this.meal.servings) {
      for (let i = 0; i < this.meal.servings; i++) {
        this.servingsOptions.push({
          label: (i + 1).toFixed(),
          value: i + 1,
        });
      }
    }

    this.nutrients = calculateNutritientsForQuantity(
      this.meal,
      this.meal.quantity
    )!;

    if (this.meal.recipe) {
      this.formGroup.get('served')?.setValue(1);
    }

    this.formGroup.get('quantity')?.setValue(this.meal.quantity);
    this.formGroup.get('mealType')?.setValue(this.mealType.toUpperCase());

    this.onFormEvent();
  }

  protected override onFormEvent(): void {
    this.formGroup.get('served')?.valueChanges.subscribe((value) => {
      const newValue = Number(value);
      const quantity = this.meal.quantity * newValue;
      this.quantity?.setValue(quantity);
    });

    this.quantity?.valueChanges.subscribe((value) => {
      const quantity = Number(value);
      if (quantity > 0) {
        this.nutrients = {
          ...calculateNutritientsForQuantity(this.meal, quantity)!,
        };
      }
    });
  }

  protected override getSubmitMethod(
    data: Meal,
    id?: string
  ): Observable<ResponseObj<Meal>> {
    if (this.mode === AddEdit.ADD) {
      return this.diaryService
        .save(data, 'meal')
        .pipe(map((response) => response as ResponseObj<Meal>));
    }

    return this.diaryService
      .update(id!, data, 'meal')
      .pipe(map((response) => response as ResponseObj<Meal>));
  }

  protected override onSubmit(): void {
    const data = this.formGroup.value;

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
          served: data.served!,
        };
    }

    this.submit(meal, this.meal._id);
  }

  protected override onSuccess(response: ResponseObj<Meal>): void {
    this.sidePanelService.closeTopComponent(response?.success);
  }

  openRecepeDetails(recipe: Recipe): void {
    this.sidePanelService.openSidePanel(RecipeDetailsComponent, {
      recipeData: recipe,
      pageTitle: recipe.name,
    });
  }

  getMacronutrients(nutrients: Nutrients): NutrientData[] {
    const nutrientsMap = new Map(nutrients.macronutrients.map((d) => [d.key, d]));

    const calories = nutrientsMap.get('calories')!;
    const carbohydrates = nutrientsMap.get('carbohydrates')!;
    const protein = nutrientsMap.get('protein')!;
    const fats = nutrientsMap.get('fats')!;

    const macros = [calories, carbohydrates, protein, fats];

    return macros;
  }
}
