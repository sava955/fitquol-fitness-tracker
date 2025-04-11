import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meal } from '../../models/meals/meal.interface';
import { Diary } from '../../models/diary/diary';
import { DiaryExercise } from '../../models/exercises/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  readonly diaryUrl = environment.beUrl + '/api/diary';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getDiaryByDay(day: Date): Observable<ResponseObj<Diary>> {
    return this.httpClient.get<ResponseObj<Diary>>(`${this.diaryUrl}/meal/${day}`);
  }

  addMeal(params: Meal): Observable<ResponseObj<{}>> {
    return this.httpClient.post<ResponseObj<{}>>(`${this.diaryUrl}/meal`, params);
  }

  updateMeal(id: string, params: Meal): Observable<ResponseObj<{}>> {
    return this.httpClient.patch<ResponseObj<{}>>(`${this.diaryUrl}/meal/${id}`, params);
  }

  deleteDiaryMeal(id: string): Observable<Meal> {
    return this.httpClient.delete<ResponseObj<Meal>>(`${this.diaryUrl}/meal/${id}`).pipe(
      map((response: ResponseObj<Meal>) => {
        if (!response.success) {
          this._snackBar.open(response.message, 'close');
        }

        return response.data;
      })
    );
  }

  addDiaryExercise(params: DiaryExercise): Observable<ResponseObj<{}>> {
    return this.httpClient.post<ResponseObj<{}>>(`${this.diaryUrl}/exercise`, params)
  }

  updateDiaryExercise(id: string, params: DiaryExercise): Observable<ResponseObj<{}>> {
    return this.httpClient.patch<ResponseObj<{}>>(`${this.diaryUrl}/exercise/${id}`, params);
  }

  deleteDiaryExercise(id: string): Observable<DiaryExercise> {
    return this.httpClient.delete<ResponseObj<DiaryExercise>>(`${this.diaryUrl}/exercise/${id}`).pipe(
      map((response: ResponseObj<DiaryExercise>) => {
        if (!response.success) {
          this._snackBar.open(response.message, 'close');
        }

        return response.data;
      })
    );
  }
}
