import { DiaryExercise } from '../exercises/exercise.interface';

export interface UserData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
  profileImage?: string;
}

export interface UserGoals {
  measurementSystem: string;
  weight: number;
  height: number;
  goal: string;
  weightPerWeek: number;
  activityLevel: string;
  caloriesRequiredPerDay?: number;
  days?: Day[];
}

export interface Day {
  day: Date;
  exercisesGroup: DiaryExercise[];
  nutrition: [];
  caloriesBalance: number;
}

export interface User extends UserData, UserGoals {}
