import { Observable,  finalize, tap } from 'rxjs';
import { NoDataFoundService } from '../services/no-data-found/no-data-found.service';

export function withNoDataFound(noDataFoundService: NoDataFoundService) {
  return <T>(source: Observable<T[]>): Observable<T[]> => {
    let receivedEmpty = false;

    return source.pipe(
      tap((response) => {
        noDataFoundService.hide();
        receivedEmpty = response.length === 0;
      }),
      finalize(() => {
        if (receivedEmpty) {
          noDataFoundService.show();
        }
      })
    );
  };
}