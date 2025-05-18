import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { Recipe } from '../models/recipe.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipesService extends HttpBaseService<Recipe> {
  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/recipes';
  }
}
