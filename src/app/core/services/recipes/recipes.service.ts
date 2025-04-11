import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { Recipe, RecipeParams, RecipRequest } from '../../models/recipes/recipes.interface';
import { PaginationData } from '../../models/pagination/pagination-data';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  readonly url = environment.beUrl + '/api/recipes';
  readonly httpClient = inject(HttpClient);
  private readonly _snackBar = inject(MatSnackBar);

  getRecipes(params: PaginationData<RecipeParams>): Observable<Recipe[]> {
    const { extraParams, ...paginationParams } = params;

    const httpParams = new HttpParams({
      fromObject: { ...paginationParams, ...extraParams },
    });

    return this.httpClient
      .get<ResponseObj<Recipe[]>>(this.url, { params: httpParams })
      .pipe(
        map((response) => {
          if (!response.success) {
            this._snackBar.open(response.message, 'close');
          }

          return response.data;
        })
      );
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.httpClient.get<ResponseObj<Recipe>>(this.url + `/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          this._snackBar.open(response.message, 'close');
        }

        return response.data;
      })
    );
  }

  createRecipe(params: RecipRequest): Observable<ResponseObj<Recipe>> {
    const formData = new FormData();

    (Object.keys(params) as (keyof Recipe)[]).forEach((key) => {
      if (key !== 'image') {
        const value = params[key];

        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as any);
        }
      }
    });

    if (params.image) {
      if (params.image instanceof File) {
        formData.append('image', params.image);
      }
    }

    return this.httpClient.post<ResponseObj<Recipe>>(this.url, formData);
  }

  updateRecipe(id: string, params: RecipRequest): Observable<ResponseObj<Recipe>> {
    const formData = new FormData();

    (Object.keys(params) as (keyof Recipe)[]).forEach((key) => {
      if (key !== 'image') {
        const value = params[key];

        if (typeof value === 'object' && value !== null) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as any);
        }
      }
    });

    if (params.image) {
      if (params.image instanceof File) {
        formData.append('image', params.image);
      }
    }

    return this.httpClient.patch<ResponseObj<Recipe>>(
      `${this.url}/${id}`,
      formData
    );
  }

  deleteRecipe(id: string): Observable<Recipe> {
    return this.httpClient.delete<ResponseObj<Recipe>>(`${this.url}/${id}`).pipe(
      map((response: ResponseObj<Recipe>) => {
        if (!response.success) {
          this._snackBar.open(response.message, 'close');
        }

        return response.data;
      })
    );
  }
}
