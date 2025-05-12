import { Meal } from "../../diary/models/meal.interface";
import { NutrientData, Nutrients, PlainNutrients } from "../../../core/models/nutrient.interface";
import { User } from "../../user/models/user.interface";


export interface RecipeParams {
  name?: string;
  category?: string;
  calories?: number;
}

export interface Recipe {
  _id?: string;
  image: File | string | null;
  name: string;
  description: string;
  preparationTime: number;
  cookingTime: number;
  servings: number;
  mealType: string;
  category: RecipeCategory;
  ingredients: Meal[];
  instructions: Instruction[];
  nutrients: Nutrients | PlainNutrients;
  createdBy?: User;
  calories?: number;
  nutritionFacts?: NutrientData[];
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
