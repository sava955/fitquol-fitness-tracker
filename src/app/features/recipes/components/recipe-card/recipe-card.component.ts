import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Recipe } from '../../models/recipe.interface';
import { MatCardModule } from '@angular/material/card';
import { NutrientData, Nutrients } from '../../../../core/models/nutrient.interface';
import { Macros } from '../../../../core/enums/macros.enum';

@Component({
  selector: 'app-recipe-card',
  imports: [MatCardModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent implements OnChanges {
  @Input() set recipe(value: Recipe) {
    this._recipe = value;
  }
  get recipe(): Recipe {
    return this._recipe;
  }

  get nutrients(): Nutrients {
    return this.recipe.nutrients as Nutrients;
  }
  
  @Output() onOpenDetails = new EventEmitter<Recipe>();

  _recipe!: Recipe;

  carbs = '';
  fats = '';
  protein = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipe'] && this.recipe) {
      this.carbs = this.getNutrients(this.recipe, Macros.CARBS);
      this.fats = this.getNutrients(this.recipe, Macros.FATS);
      this.protein = this.getNutrients(this.recipe, Macros.PROTEIN);
    }
  }

  getNutrients(recipe: Recipe, macro: string): string {
    const macros = [Macros.CARBS, Macros.FATS, Macros.PROTEIN];
    const nutrients = recipe.nutrients as Nutrients;
    const macronutrients = nutrients.macronutrients.filter((m) =>
      macros.includes(m.key as Macros)
    );

    const nutrient = macronutrients.find((m) => m.key === macro)?.value ?? 0;

    return nutrient.toFixed();
  }

  openDetails(recipe: Recipe): void {
    this.onOpenDetails.emit(recipe);
  }
}
