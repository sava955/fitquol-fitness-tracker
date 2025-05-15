import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpBaseService } from '../../../../core/services/http-base.service';
import { Exercise } from '../../models/exercise.interface';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService extends HttpBaseService<Exercise> {
  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/exercises';
  }
}
