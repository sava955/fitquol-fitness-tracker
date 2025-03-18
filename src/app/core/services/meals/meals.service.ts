import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { Meal } from '../../models/meals/meal.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  readonly url = environment.beUrl + '/api/meals';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getMeals(params: any): Observable<Meal[]> {
    const httpParams = new HttpParams({ fromObject: { ...params } });
    return this.httpClient.get<ResponseObj<Meal[]>>(this.url, { params: httpParams }).pipe(map(response => {
      if (!response.success) {
        this._snackBar.open(response.message, 'close');
      }

      return response.data;
    }));
  }

  getMeal(id: string): Observable<Meal> {
    return this.httpClient.get<ResponseObj<Meal>>(this.url + `/${id}`).pipe(map(response => {
      if (!response.success) {
        this._snackBar.open(response.message, 'close');
      }

      return response.data;
    }));
  }
}
