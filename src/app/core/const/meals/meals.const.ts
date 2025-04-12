import { Meal } from '../../models/meals/meal.interface';
import { Column } from '../../models/table/table';

export const mealColumns = (
  openDetails: (row: Meal) => void
): Column<Meal>[] => [
  {
    id: 'name',
    label: 'Food',
    value: 'name',
    openDetails: (row: Meal) => {
      openDetails(row);
    },
  },
  {
    id: 'calories',
    label: 'Calories per 100g',
    value: 'calories',
    openDetails: (row: Meal) => {
      openDetails(row);
    },
  },
];
