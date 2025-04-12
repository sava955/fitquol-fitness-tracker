import { Exercise } from '../../models/exercises/exercise.interface';
import { Column } from '../../models/table/table';

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

export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
