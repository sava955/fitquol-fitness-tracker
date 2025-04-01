import { Observable, finalize } from 'rxjs';
import { LocalSpinnerService } from '../services/local-spinner/local-spinner.service';

export function withLocalAppSpinner(
  spinnerService: LocalSpinnerService
) {
  return <T>(source: Observable<T>): Observable<T> => {
    spinnerService.show();

    return source.pipe(
      finalize(() => spinnerService.hide())
    );
  };
}