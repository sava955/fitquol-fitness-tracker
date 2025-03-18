import { DiaryMeal } from '../../models/meals/meal.interface';
import { Column } from '../../models/table/table';

export const diaryMealColumns = (
  meal: { id: string, label: string },
  editMeal: (row: DiaryMeal) => void,
  deleteMeal: (row: DiaryMeal) => void
): Column<DiaryMeal>[] => [
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
        action: (row: DiaryMeal) => {
          editMeal(row);
        },
      },
      {
        label: 'delete',
        action: (row: DiaryMeal) => {
          deleteMeal(row);
        },
      },
    ],
  },
];

export const exercisesColumns = (
  editExercise: (row: DiaryMeal) => void,
  deleteExercise: (row: DiaryMeal) => void
): Column<DiaryMeal>[] => [
  {
    id: 'name',
    label: 'Exercise',
    value: 'name',
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
        action: (row: DiaryMeal) => {
          editExercise(row);
        },
      },
      {
        label: 'delete',
        action: (row: DiaryMeal) => {
          deleteExercise(row);
        },
      },
    ],
  },
];