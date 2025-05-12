
import { Recipe } from '../models/recipe.interface';
import { Column } from '../../../core/models/table';

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
    width: '60%',
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