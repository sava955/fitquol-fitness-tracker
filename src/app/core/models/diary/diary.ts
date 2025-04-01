import { DiaryExercise } from "../exercises/exercise.interface";
import { Meal, Nutrients } from "../meals/meal.interface"
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