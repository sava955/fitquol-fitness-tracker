export function resetParams(): any {
  const params = {
    start: 0,
    limit: 10,
  };

  return params;
}

export function setParams(
  paginationData: any,
  extraParams: Partial<any> = {}
): any {
  const params = {
    start: paginationData.start,
    limit: paginationData.limit,
    ...extraParams,
  };

  return params;
}
