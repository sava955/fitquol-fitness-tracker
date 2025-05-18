import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { Diary } from '../models/diary.interface';
import { Meal } from '../models/meal.interface';
import { DiaryExercise } from '../models/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class DiaryService extends HttpBaseService<Diary | Meal | DiaryExercise> {
  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/diary';
  }
}
