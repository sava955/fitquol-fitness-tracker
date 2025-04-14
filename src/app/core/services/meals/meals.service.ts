import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { Meal, MealParams } from '../../models/meals/meal.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginationData } from '../../models/pagination/pagination-data';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  readonly url = environment.beUrl + '/api/food';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getMeals(params: PaginationData<MealParams>): Observable<Meal[]> {
    const { extraParams, ...paginationParams } = params;

    const allParams = {
      ...paginationParams,
      ...(extraParams?.food && { food: extraParams.food }),
      ...(extraParams?.date && { date: extraParams.date }),
    };
  
    const httpParams = new HttpParams({
      fromObject: allParams as Record<string, string | number | boolean>,
    });  

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
