import { Recipe } from '../../models/recipes/recipes.interface';
import { Column } from '../../models/table/table';

export const recipeColumns = (
  openDetails: (row: Recipe) => void,
): Column<Recipe>[] => [
  {
    id: 'image',
    label: 'Photo',
    value: 'image',
    openDetails: (row: Recipe) => {
      openDetails(row);
    },
  },
  {
    id: 'name',
    label: 'Food',
    value: 'name',
    openDetails: (row: Recipe) => {
      openDetails(row);
    },
  },
  {
    id: 'calories',
    label: 'Calories per serving',
    value: 'calories',
    openDetails: (row: Recipe) => {
      openDetails(row);
    }
  },
];