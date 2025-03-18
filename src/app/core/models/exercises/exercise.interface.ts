export interface ExerciseGroup {
  day: Date;
  exercise: Exercise;
  sets: number;
  setDuration: number;
  status: string;
  caloriesBurned: number;
}

export interface Exercise {
  _id: string;
  code: string;
  mets: number;
  category: string;
  description: string;
}

export interface ExerciseParams {
  start: number;
  limit: number;
  description?: string;
}
