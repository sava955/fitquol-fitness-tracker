import { Nutrients, PlainNutrients } from '../nutrients/nutrient.interface';
import { Recipe } from '../recipes/recipes.interface';

export interface MealParams {
  food?: string;
  date?: Date;
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

export interface Food extends PlainNutrients {
  food: string;
  other_names: string;
  comments: string;
  source: string;
  category: string;
}