import { Goal } from "../../../core/models/goal";
import { NutrientData } from "../../../core/models/nutrient.interface";

export interface Dashboard {
  todayCalories: TodayCalories;
  todayMacros: NutrientData[];
  caloriesStatistic: CaloriesStatistic[];
  weightStatistic: Goal[];
  exercisesStatistic: ExercisesStatistic[];
  startDate: Date;
}

export interface TodayCalories {
  caloriesRequired: number;
  takenCalories: number;
  burnedCalories: number;
}

export interface CaloriesStatistic {
  date: Date;
  takenCalories: number;
  burnedCalories: number;
  caloriesBalance: number;
}

export interface ExercisesStatistic {
  date: Date;
  burnedCalories: number;
  durationSum: number;
}

export interface PeriodParams {
  startDate: Date;
  endDate: Date;
}
