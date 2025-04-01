import { PaginationData } from '../pagination/pagination-data';

export interface MealParams extends PaginationData {
  food?: string;
}

export interface Meal {
  _id?: string;
  name: string;
  quantity: number;
  measurementUnit: string;
  nutrients: Nutrients;
  day: string;
  mealType: string;
  diary?: string;
}

export interface Nutrients {
  calories: number;
  macronutrients: NutrientData[];
  micronutrients: NutrientData[];
}

export interface NutrientData {
  name: string;
  key: string;
  value: number;
  unitOfMeasurement: string;
  percentageOfTotal: number;
  dailyLimit: number;
}
