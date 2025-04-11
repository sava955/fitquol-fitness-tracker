import { Nutrients } from '../nutrients/nutrient.interface';
import { Recipe } from '../recipes/recipes.interface';

export interface MealParams {
  food?: string;
}

export interface Meal {
  _id?: string;
  image?: string;
  name: string;
  quantity: number;
  servings?: number;
  served?: number;
  measurementUnit: string;
  nutrients: Nutrients;
  day: string;
  mealType: string;
  recipe?: Recipe;
  diary?: string;
}

