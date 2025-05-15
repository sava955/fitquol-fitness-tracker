import { Goal } from '../../../core/models/goal';
import { Column } from '../../../core/models/table';

export const goalsColumns = (
  openDetails: (row: Goal) => void
): Column<Goal>[] => [
  {
    id: 'fromDate',
    label: 'Created at',
    value: 'fromDate',
    openDetails: (row: Goal) => {
      openDetails(row);
    },
  },
  {
    id: 'goal',
    label: 'Goal',
    value: 'goal',
    openDetails: (row: Goal) => {
      openDetails(row);
    },
  },
];
