import { DiaryExercise } from "../exercises/exercise.interface";
import { Meal } from "../meals/meal.interface"
import { Nutrients } from "../nutrients/nutrient.interface";
import { Column } from "../table/table";
import { User } from "../user/user.interface";

export interface Diary {
    _id: string;
    day: string;
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
    exercises: DiaryExercise[];
    takenCalories: number;
    burnedCalories: number;
    caloriesBalance: number;
    nutrients: Nutrients;
    user: User;
}

export type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface MealTable<T> {
    meal: string;
    columns: Column<T>[];
    data: Meal[];
}