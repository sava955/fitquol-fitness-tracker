import { PaginationData } from '../../core/models/pagination/pagination-data';

export function resetParams<T>(pageData: PaginationData<T>): PaginationData<T> {
  const params = {
    start: pageData.start,
    limit: pageData.limit,
  };

  return params;
}

export function setParams<T>(
  paginationData: PaginationData<T>,
  extraParams: Partial<T> = {}
): PaginationData<T> {
  const params = {
    start: paginationData.start,
    limit: paginationData.limit,
    ...extraParams,
  };

  return params;
}
