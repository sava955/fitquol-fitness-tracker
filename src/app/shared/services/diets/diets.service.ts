import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { ResponseObj } from '../../../core/models/http-response/http-response.interface';
import { Diet } from '../../../core/models/diet/diet';

@Injectable({
  providedIn: 'root',
})
export class DietsService {
  readonly url = environment.beUrl + '/api/diets';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getDitet(): Observable<Diet> {
    return this.httpClient
      .get<ResponseObj<Diet>>(this.url)
      .pipe(
        map((response) => {
          if (!response.success) {
            this._snackBar.open(response.message, 'close');
          }

          return response.data;
        })
      );
  }
}
