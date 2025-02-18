import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Exercise, ExerciseGroup, ExerciseParams } from '../../models/exercises/exercise.interface';
import { environment } from '../../../../environments/environment.development';
import { ResponseObj } from '../../models/http-response/http-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  readonly url = environment.beUrl + '/api/exercises';
  readonly httpClient = inject(HttpClient);

  getExercises(params: ExerciseParams): Observable<ResponseObj<Exercise[]>> {
    const httpParams = new HttpParams({fromObject: {...params}});
    return this.httpClient.get<ResponseObj<Exercise[]>>(this.url, {params: httpParams});
  }

  getExercise(id: string): Observable<ResponseObj<Exercise>> {
    return this.httpClient.get<ResponseObj<Exercise>>(this.url + `/${id}`);
  }

  addExercises(exerciseGrpup: ExerciseGroup[]): Observable<ExerciseGroup[]> {
    const observable = new Observable<ExerciseGroup[]>((subscriber) => {
      subscriber.next(exerciseGrpup);
      subscriber.complete();
    });

    return observable;
  }
}
