import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meal } from '../../models/meals/meal.interface';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  readonly diaryUrl = environment.beUrl + '/api/diary';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getDiaryByDay(day: Date): Observable<ResponseObj<any>> {
    return this.httpClient.get<ResponseObj<any>>(`${this.diaryUrl}/meal/${day}`);
  }

  addMeal(params: Meal): Observable<any> {
    return this.httpClient.post<any>(`${this.diaryUrl}/meal`, params);
  }

  updateMeal(id: string, params: Meal): Observable<ResponseObj<Meal>> {
    return this.httpClient.patch<ResponseObj<Meal>>(`${this.diaryUrl}/meal/${id}`, params);
  }

  deleteDiaryMeal(id: string): Observable<ResponseObj<Meal>> {
    return this.httpClient.delete<ResponseObj<Meal>>(`${this.diaryUrl}/meal/${id}`).pipe(
      map((response: ResponseObj<any>) => {
        if (!response.success) {
          this._snackBar.open(response.message, 'close');
        }

        return response.data;
      })
    );
  }

  addDiaryExercise(params: any): Observable<ResponseObj<any>> {
    return this.httpClient.post<ResponseObj<any>>(`${this.diaryUrl}/exercise`, params)
  }

  updateDiaryExercise(id: string, params: any): Observable<ResponseObj<any>> {
    return this.httpClient.patch<ResponseObj<any>>(`${this.diaryUrl}/exercise/${id}`, params);
  }

  addDiaryExerciseProgram(params: any): Observable<ResponseObj<any>> {
    return this.httpClient.post<ResponseObj<any>>(`${this.diaryUrl}/exercise-program`, params)
  }

  deleteDiaryExercise(id: string): Observable<ResponseObj<any>> {
    return this.httpClient.delete<ResponseObj<any>>(`${this.diaryUrl}/exercise/${id}`).pipe(
      map((response: ResponseObj<any>) => {
        if (!response.success) {
          this._snackBar.open(response.message, 'close');
        }

        return response.data;
      })
    );
  }
}
