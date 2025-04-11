export interface DiaryExercise {
  _id?: string;
  day: Date;
  exercise: Exercise;
  sets: number;
  setDuration: number;
  caloriesBurned: number;
  diary: string;
}

export interface Exercise {
  _id: string;
  code: string;
  mets: number;
  category: string;
  description: string;
}

export interface ExerciseParams {
  description?: string;
}
