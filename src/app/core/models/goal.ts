import { UnitMeasurment, UserGoal } from "../../features/user/enums/user.enum";
import { Macronutrients, Micronutrients } from "./nutrient.interface";
import { User } from "../../features/user/models/user.interface";

export interface Goal {
  fromDate: Date;
  measurementSystem: UnitMeasurment.METRIC | UnitMeasurment.IMPERIAL;
  weight: number;
  height: number;
  goal: UserGoal.LOSE_WEIGHT | UserGoal.REMAIN_WEIGHT | UserGoal.GAIN_WEIGHT ;
  weightPerWeek: number;
  activityLevel: string;
  caloriesRequired: number;
  macronutrients: Macronutrients;
  micronutrients: Micronutrients;
  user: User;
}