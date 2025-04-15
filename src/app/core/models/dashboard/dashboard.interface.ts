import { Goal } from '../goals/goal';
import { NutrientData } from '../nutrients/nutrient.interface';

export interface Dashboard {
  todayCalories: TodayCalories;
  todayMacros: NutrientData[];
  calories: Calories[];
  weight: Goal[];
}

export interface TodayCalories {
  caloriesRequired: number;
  takenCalories: number;
  burnedCalories: number;
}

export interface Calories {
  date: Date;
  takenCalories: number;
  burnedCalories: number;
  caloriesBalance: number;
}
