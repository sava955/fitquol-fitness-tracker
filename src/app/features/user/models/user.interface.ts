import { Gender, UserGoal, UnitMeasurment } from '../enums/user.enum';
import { Goal } from '../../../core/models/goal';
import { DiaryExercise } from '../../diary/models/exercise.interface';

export interface UserData {
  _id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender.MALE | Gender.FEMALE;
  email: string;
  profileImage?: string;
}

export interface UserGoals {
  date: Date;
  measurementSystem: UnitMeasurment.METRIC | UnitMeasurment.IMPERIAL;
  weight: number;
  height: number;
  heightFeet?: number;
  heightInches?: number;
  goal: UserGoal.LOSE_WEIGHT | UserGoal.REMAIN_WEIGHT | UserGoal.GAIN_WEIGHT ;
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

export interface UserRequest extends UserData, UserGoals, Password {
  role: string;
}

export interface User extends UserData {
  goals: Goal[];
  role: string;
}

export interface Password {
  password: string;
  passwordConfirmation: string;
}

export interface PasswordRequest extends Password {
  currentPassword: string;
}

