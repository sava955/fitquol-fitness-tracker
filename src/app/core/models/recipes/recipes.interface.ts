import { Meal } from '../meals/meal.interface';
import { Nutrients, PlainNutrients } from '../nutrients/nutrient.interface';
import { User } from '../user/user.interface';

export interface RecipeParams {
  name?: string;
  category?: string;
  calories?: number;
}

export interface Recipe {
  _id?: string;
  image: string;
  name: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  mealType: string;
  category: RecipeCategory;
  ingredients: Meal[];
  instructions: Instruction[];
  nutrients: Nutrients;
  createdBy?: User;
}

export interface RecipRequest {
  _id?: string;
  image: File | null;
  name: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  mealType: string;
  category: RecipeCategory;
  ingredients: Meal[];
  instructions: Instruction[];
  nutrients: PlainNutrients,
  createdBy?: User;
}

export interface Instruction {
  description: string;
}

export interface RecipeCategory {
  _id: string;
  name: string;
  recipes: Recipe[];
}

export interface RecipeCategoryParams {
  name: string;
}
