export interface PaginationData<T> {
  start?: number;
  limit?: number;
  extraParams?: T;
}
