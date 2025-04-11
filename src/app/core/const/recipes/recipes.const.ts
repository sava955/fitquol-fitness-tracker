import { Recipe } from '../../models/recipes/recipes.interface';
import { Column } from '../../models/table/table';

export const recipeColumns = (
  openDetails: (row: Recipe) => void,
): Column<Recipe>[] => [
  {
    id: 'image',
    label: 'Photo',
    value: 'image',
  },
  {
    id: 'name',
    label: 'Food',
    value: 'name',
  },
  {
    id: 'calories',
    label: 'Calories per serving',
    value: 'calories'
  },
  {
    id: 'action',
    label: 'action',
    value: 'action',
    actions: [
      {
        label: 'add',
        action: (row: Recipe) => {
          openDetails(row);
        },
      },
    ],
  },
];