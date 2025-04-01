import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Exercise,
  DiaryExercise,
  ExerciseParams,
} from '../../models/exercises/exercise.interface';
import { environment } from '../../../../environments/environment.development';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  readonly url = environment.beUrl + '/api/exercises';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);
  /*getExercises(params: ExerciseParams): Observable<ResponseObj<Exercise[]>> {
    const httpParams = new HttpParams({fromObject: {...params}});
    return this.httpClient.get<ResponseObj<Exercise[]>>(this.url, {params: httpParams});
  }*/

  getExercises(params: ExerciseParams): Observable<Exercise[]> {
    const httpParams = new HttpParams({ fromObject: { ...params } });
    return this.httpClient
      .get<ResponseObj<Exercise[]>>(this.url, { params: httpParams })
      .pipe(
        map((response) => {
          if (!response.success) {
            this._snackBar.open(response.message, 'close');
          }

          return response.data;
        })
      );
  }

  getExercise(id: string): Observable<ResponseObj<Exercise>> {
    return this.httpClient.get<ResponseObj<Exercise>>(this.url + `/${id}`);
  }

  addExercises(exerciseGrpup: DiaryExercise[]): Observable<DiaryExercise[]> {
    const observable = new Observable<DiaryExercise[]>((subscriber) => {
      subscriber.next(exerciseGrpup);
      subscriber.complete();
    });

    return observable;
  }
}
