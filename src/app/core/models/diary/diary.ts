import { DiaryMeal } from "../meals/meal.interface"
import { User } from "../user/user.interface";

export interface Diary {
    _id: string;
    day: string;
    breakfast: DiaryMeal[];
    lunch: DiaryMeal[];
    dinner: DiaryMeal[];
    snacks: DiaryMeal[];
    caloriesBalance: number;
    exercisesGroup: [];
    user: User;
}