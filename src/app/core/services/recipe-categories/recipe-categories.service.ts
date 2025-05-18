import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpBaseService } from '../http-base.service';
import { RecipeCategory } from '../../../features/recipes/models/recipe.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeCategoriesService extends HttpBaseService<RecipeCategory> {
  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/recipe-categories';
  }
}
