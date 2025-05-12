import { DiaryExercise } from "./exercise.interface";
import { Goal } from "../../../core/models/goal";
import { Meal } from "./meal.interface";
import { Nutrients } from "../../../core/models/nutrient.interface";
import { Column } from "../../../core/models/table";
import { User } from "../../user/models/user.interface";


export interface Diary {
    _id: string;
    day: string;
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
    exercises: DiaryExercise[];
    goal: Goal;
    takenCalories: number;
    burnedCalories: number;
    caloriesBalance: number;
    nutrients: Nutrients;
    startDate: Date;
    user: User;
}

export type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface MealTable<T> {
    meal: string;
    columns: Column<T>[];
    data: Meal[];
}