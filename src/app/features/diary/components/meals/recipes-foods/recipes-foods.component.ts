import { Component, Input } from '@angular/core';
import { RecipesData } from '../../../../../shared/components/recipes-data/recipes-data.component';
import { AddEditMealComponent } from '../add-edit-meal/add-edit-meal.component';
import { AddEdit } from '../../../../../core/enums/add-edit.enum';
import { MatCardModule } from '@angular/material/card';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { LocalSpinnerComponent } from '../../../../../shared/components/local-spinner/local-spinner.component';
import { recipeColumns } from '../../../../recipes/const/recipes.const';
import { ReactiveFormsModule } from '@angular/forms';
import { Nutrients } from '../../../../../core/models/nutrient.interface';
import { Recipe } from '../../../../recipes/models/recipe.interface';
import { RecipeCardComponent } from '../../../../recipes/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-recipes-foods',
  imports: [
    MatCardModule,
    InputComponent,
    LocalSpinnerComponent,
    ReactiveFormsModule,
    RecipeCardComponent
  ],
  templateUrl: './recipes-foods.component.html',
  styleUrl: './recipes-foods.component.scss',
})
export class RecipesFoodsComponent extends RecipesData {
  @Input() day!: Date;
  @Input() mealType!: string;

  recipeColumns = recipeColumns(this.openDetails.bind(this));
  nutrients!: Nutrients;

  openDetails(row: Recipe): void {
    const meal = {
      image: row.image,
      name: row.name,
      quantity: this.calculateQuantity(row),
      servings: row.servings,
      measurementUnit: 'g',
      nutrients: row.nutrients,
      day: this.day,
      mealType: this.mealType,
      recipe: row,
    };

    this.sidePanelService.openSidePanel(AddEditMealComponent, {
      meal: meal,
      day: this.day,
      mealType: this.mealType,
      mode: AddEdit.ADD,
      pageTitle: this.mealType,
    });
  }

  calculateQuantity(recipe: Recipe): number {
    return recipe.ingredients.reduce(
      (sum, ingredient) => sum + (ingredient.quantity || 0),
      0
    );
  }
}
