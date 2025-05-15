import { AddEdit } from '../../../core/enums/add-edit.enum';
import { ActionButtons } from '../../../core/models/action.buttons.interface';
import { Meal } from '../models/meal.interface';
import { Column } from '../../../core/models/table';

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

export const mealActionButtons = (
  goBack: () => void,
  onSubmit: () => void,
  mode: string
): ActionButtons[] => [
  {
    label: 'Cancel',
    action: () => {
      goBack();
    },
    style: 'secondary',
  },
  {
    label: mode === AddEdit.ADD ? 'Add meal' : 'Update meal',
    action: () => {
      onSubmit();
    },
  },
];
