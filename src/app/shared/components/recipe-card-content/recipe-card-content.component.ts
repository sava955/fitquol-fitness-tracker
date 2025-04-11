import { Component, Input } from '@angular/core';
import { Recipe } from '../../../core/models/recipes/recipes.interface';

@Component({
  selector: 'app-recipe-card-content',
  imports: [],
  templateUrl: './recipe-card-content.component.html',
  styleUrl: './recipe-card-content.component.scss'
})
export class RecipeCardContentComponent {
  @Input() recipe!: Recipe;
}
