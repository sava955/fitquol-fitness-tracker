import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpBaseService } from '../../../../core/services/http-base.service';
import { Meal } from '../../models/meal.interface';

@Injectable({
  providedIn: 'root',
})
export class MealsService extends HttpBaseService<Meal> {
  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/food';
  }
}
