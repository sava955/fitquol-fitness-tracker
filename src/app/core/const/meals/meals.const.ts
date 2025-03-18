import { Meal } from '../../models/meals/meal.interface';
import { Column } from '../../models/table/table';

export const mealColumns = (openDetails: (row: Meal) => void): Column<Meal>[] => [
  {
    id: 'food',
    label: 'Food',
    value: 'name',
  },
  {
    id: 'calories',
    label: 'Calories per 100g',
    value: 'calories',
  },
  {
    id: 'action',
    label: 'action',
    value: 'action',
    actions: [
      {
        label: 'add',
        action: (row: Meal) => {
          openDetails(row);
        },
      },
    ],
  },
];
