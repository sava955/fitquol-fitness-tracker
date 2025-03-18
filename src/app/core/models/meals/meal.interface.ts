import { PaginationData } from "../pagination/pagination-data";

export interface Meal extends Nutritients {
  _id: string;
  name: string;
}

export interface Nutritients {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

export interface MealParams extends PaginationData {
  name?: string;
}

export interface DiaryMeal {
  _id?: string;
  name: string;
  quantity: number;
  measurementUnit: string;
  nutritients: Nutritients;
  day: Date;
  mealType: string;
  diary?: string;
}