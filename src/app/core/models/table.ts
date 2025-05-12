export interface Column<T> {
  id: string;
  label: string;
  value: string;
  width?: string;
  openDetails?: (item: T) => void;
  actions?: ColumnAction<T>[];
}

export interface ColumnAction<T> {
  label: string;
  action: (item: T) => void;
}
