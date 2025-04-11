import { Component } from '@angular/core';
import { RecipesData } from '../../../shared/components/recipes-data/recipes-data.component';
import { AddEditMealComponent } from '../add-edit-meal/add-edit-meal.component';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';
import { MatCardModule } from '@angular/material/card';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import { TableDataComponent } from '../../../shared/components/table-data/table-data.component';
import { LocalSpinnerComponent } from '../../../shared/components/local-spinner/local-spinner.component';
import { recipeColumns } from '../../../core/const/recipes/recipes.const';
import { Recipe } from '../../../core/models/recipes/recipes.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { Nutrients } from '../../../core/models/nutrients/nutrient.interface';

@Component({
  selector: 'app-recipes-foods',
  imports: [
    MatCardModule,
    InputBaseComponent,
    TableDataComponent,
    LocalSpinnerComponent,
    ReactiveFormsModule
  ],
  templateUrl: './recipes-foods.component.html',
  styleUrl: './recipes-foods.component.scss',
})
export class RecipesFoodsComponent extends RecipesData {
  recipeColumns = recipeColumns(this.openDetails.bind(this));
  nutrients!: Nutrients;

  day =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.day;
  mealType =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.mealType;
  diary =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.diary;

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
      diary: this.diary,
      recipe: row,
    };

    this.sidePanelService.openSidePanel(AddEditMealComponent, {
      data: {
        meal: meal,
        day: this.day,
        mealType: this.mealType,
        mode: AddEdit.ADD,
      },
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
