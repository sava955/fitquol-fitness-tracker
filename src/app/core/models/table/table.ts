export interface Column<T> {
    id: string;
    label: string;
    value: string;
    actions?: ColumnAction<T>[];
}

export interface ColumnAction<T> {
    label: string;
    action: (item: T) => void;
}