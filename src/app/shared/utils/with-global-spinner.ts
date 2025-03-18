import { Observable, finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner/spinner-service.service';

export function withGlobalAppSpinner(
  spinnerService: SpinnerService,
  message: string
) {
  return <T>(source: Observable<T>): Observable<T> => {
    spinnerService.show(message);

    return source.pipe(
      finalize(() => spinnerService.hide())
    );
  };
}