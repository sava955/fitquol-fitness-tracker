import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { ResponseObj } from '../../../core/models/http-response/http-response.interface';
import { RecipeCategory, RecipeCategoryParams } from '../../../core/models/recipes/recipes.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeCategoriesService {
  readonly url = environment.beUrl + '/api/recipe-categories';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getRecipeCategories(params: RecipeCategoryParams): Observable<RecipeCategory[]> {
    const httpParams = new HttpParams({ fromObject: { ...params } });
    return this.httpClient
      .get<ResponseObj<RecipeCategory[]>>(this.url, { params: httpParams })
      .pipe(
        map((response) => {
          if (!response.success) {
            this._snackBar.open(response.message, 'close');
          }

          return response.data;
        })
      );
  }
}
