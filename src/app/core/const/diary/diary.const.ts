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
  editExercise: (row: Meal) => void,
  deleteExercise: (row: Meal) => void
): Column<Meal>[] => [
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
        action: (row: Meal) => {
          editExercise(row);
        },
      },
      {
        label: 'delete',
        action: (row: Meal) => {
          deleteExercise(row);
        },
      },
    ],
  },
];