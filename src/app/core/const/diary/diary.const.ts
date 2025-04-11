import { MealTable } from '../../models/diary/diary';
import { DiaryExercise } from '../../models/exercises/exercise.interface';
import { Meal } from '../../models/meals/meal.interface';
import { Column } from '../../models/table/table';

export const diaryMealColumns = (
  meal: { id: string, label: string },
  editMeal: (row: Meal) => void,
  deleteMeal: (row: Meal) => void
): Column<Meal>[] => [
  {
    id: meal.id,
    label: meal.label,
    value: 'name',
  },
  {
    id: 'quantity',
    label: 'Quantity',
    value: 'quantity',
  },
  {
    id: 'calories',
    label: '',
    value: 'calories',
  },
  {
    id: 'action',
    label: 'action',
    value: 'action',
    actions: [
      {
        label: 'edit',
        action: (row: Meal) => {
          editMeal(row);
        },
      },
      {
        label: 'delete',
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
  },
  {
    id: 'calories',
    label: '',
    value: 'calories',
  },
  {
    id: 'action',
    label: 'action',
    value: 'action',
    actions: [
      {
        label: 'edit',
        action: (row: DiaryExercise) => {
          editExercise(row);
        },
      },
      {
        label: 'delete',
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