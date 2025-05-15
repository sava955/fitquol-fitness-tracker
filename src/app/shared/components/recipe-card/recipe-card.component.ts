import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Recipe } from '../../models/recipe.interface';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Nutrients } from '../../../../core/models/nutrients/nutrient.interface';

@Component({
  selector: 'app-recipe-card',
  imports: [MatCardModule, RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent implements OnChanges {
  @Input() recipe!: Recipe;

  carbs = '';
  fats = '';
  protein = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipe'] && this.recipe) {
      this.carbs = this.getNutrients(this.recipe, 'carbohydrates');
      this.fats = this.getNutrients(this.recipe, 'fats');
      this.protein = this.getNutrients(this.recipe, 'protein');
    }
  }

  getNutrients(recipe: Recipe, macro: string): string {
    const macros = ['carbohydrates', 'fats', 'protein'];
    const nutrients = recipe.nutrients as Nutrients;
    const macronutrients = nutrients.macronutrients.filter((m) =>
      macros.includes(m.key)
    );

    const nutrient = macronutrients.find((m) => m.key === macro)?.value ?? 0;
    const total = macronutrients.reduce((sum, m) => sum + (m.value || 0), 0);

    if (total === 0) return '0';
    return ((nutrient / total) * 100).toFixed();
  }
}
