import { Recipe } from '../../recipes/models/recipe.interface';
import { NutrientData, Nutrients, PlainNutrients } from '../../../core/models/nutrient.interface';

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
  day: Date;
  mealType: string;
  recipe?: Recipe;
  diary?: string;
  nutritionFacts?: NutrientData[];
}

export interface Food extends PlainNutrients {
  food: string;
  other_names: string;
  comments: string;
  source: string;
  category: string;
}