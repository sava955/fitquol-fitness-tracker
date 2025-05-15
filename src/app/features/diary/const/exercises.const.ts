import { AddEdit } from '../../../core/enums/add-edit.enum';
import { ActionButtons } from '../../../core/models/action.buttons.interface';
import { Exercise } from '../models/exercise.interface';
import { Column } from '../../../core/models/table';

export const exercisesColumns = (
  openDetails: (row: Exercise) => void
): Column<Exercise>[] => [
  {
    id: 'description',
    label: 'Exercises',
    value: 'description',
    openDetails: (row: Exercise) => {
      openDetails(row);
    },
  },
];

export const exerciseActionButtons = (
  goBack: () => void,
  onSubmit: () => void,
  mode: string
): ActionButtons[] => [
  {
    label: 'Cancel',
    action: () => {
      goBack()
    },
    style: 'secondary',
  },
  {
    label: mode === AddEdit.ADD ? 'Add exercise' : 'Update exercise',
    action: () => {
      onSubmit();
    },
  },
];

export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
