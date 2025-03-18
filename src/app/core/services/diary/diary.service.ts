import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiaryMeal } from '../../models/meals/meal.interface';

@Injectable({
  providedIn: 'root',
})
export class DiaryService {
  readonly diaryUrl = environment.beUrl + '/api/diary';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getDiaryByDay(day: Date): Observable<ResponseObj<any>> {
    return this.httpClient.get<ResponseObj<any>>(`${this.diaryUrl}/${day}`);
  }

  addMeal(params: DiaryMeal): Observable<ResponseObj<DiaryMeal>> {
    return this.httpClient.post<ResponseObj<DiaryMeal>>(this.diaryUrl, params);
  }

  updateMeal(id: string, params: DiaryMeal): Observable<ResponseObj<DiaryMeal>> {
    return this.httpClient.patch<ResponseObj<DiaryMeal>>(this.diaryUrl + `/${id}`, params);
  }

  deleteDiaryMeal(id: string): Observable<ResponseObj<DiaryMeal>> {
    return this.httpClient.delete<ResponseObj<DiaryMeal>>(this.diaryUrl + `/${id}`).pipe(
      map((response: ResponseObj<any>) => {
        if (!response.success) {
          this._snackBar.open(response.message, 'close');
        }

        return response.data;
      })
    );
  }
}
