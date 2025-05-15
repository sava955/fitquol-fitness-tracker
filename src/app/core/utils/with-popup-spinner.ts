import { Observable, finalize } from 'rxjs';
import { PopupSpinnerService } from '../services/popup-spinner/popup-spinner-service.service';

export function withPopupAppSpinner(
  spinnerService: PopupSpinnerService,
  message: string
) {
  return <T>(source: Observable<T>): Observable<T> => {
    spinnerService.show(message);

    return source.pipe(
      finalize(() => spinnerService.hide())
    );
  };
}