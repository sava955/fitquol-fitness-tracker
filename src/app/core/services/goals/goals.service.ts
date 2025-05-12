import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { ResponseObj } from '../../models/http-response.interface';
import { Goal } from '../../../core/models/goal';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  readonly url = environment.beUrl + '/api/goals';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getGoals(): Observable<Goal> {
    return this.httpClient
      .get<ResponseObj<Goal>>(this.url)
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
