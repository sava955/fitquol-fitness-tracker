import { DiaryExercise } from '../models/exercise.interface';
import { Meal } from '../models/meal.interface';
import { Column } from '../../../core/models/table';
import { MealTable } from '../models/diary.interface';

export const diaryMealColumns = (
  meal: { id: string; label: string },
  editMeal: (row: Meal) => void,
  deleteMeal: (row: Meal) => void
): Column<Meal>[] => [
  {
    id: meal.id,
    label: meal.label,
    value: 'name',
    width: '60%',
    openDetails: (row: Meal) => {
      editMeal(row);
    },
  },
  {
    id: 'calories',
    label: '',
    value: 'calories',
    openDetails: (row: Meal) => {
      editMeal(row);
    },
  },
  {
    id: 'action',
    label: 'action',
    value: 'action',
    actions: [
      {
        label: 'Delete',
        value: 'delete',
        action: (row: Meal) => {
          deleteMeal(row);
        },
      },
    ],
  },
];

export const diaryExercisesColumns = (
  editExercise: (row: DiaryExercise) => void,
  deleteExercise: (row: DiaryExercise) => void
): Column<DiaryExercise>[] => [
  {
    id: 'description',
    label: 'Exercises',
    value: 'description',
    width: '60%',
    openDetails: (row: DiaryExercise) => {
      editExercise(row);
    },
  },
  {
    id: 'calories',
    label: '',
    value: 'calories',
    openDetails: (row: DiaryExercise) => {
      editExercise(row);
    },
  },
  {
    id: 'action',
    label: 'action',
    value: 'action',
    actions: [
      {
        label: 'Delete',
        value: 'delete',
        action: (row: DiaryExercise) => {
          deleteExercise(row);
        },
      },
    ],
  },
];

export const meals: MealTable<Meal>[] = [
  {
    meal: 'breakfast',
    columns: [],
    data: [],
  },
  { meal: 'lunch', columns: [], data: [] },
  { meal: 'dinner', columns: [], data: [] },
  { meal: 'snacks', columns: [], data: [] },
];
