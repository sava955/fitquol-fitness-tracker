import { Component, inject } from '@angular/core';
import { resetParams, setParams } from '../../../core/utils/handle-params';
import { PaginationData } from '../../../core/models/pagination-data';
import { TableSearch } from '../table-search/table-search.component';
import { map, Observable } from 'rxjs';
import { mapCalories } from '../../../core/utils/map-calories';
import { RecipesService } from '../../../features/recipes/services/recipes.service';
import { Recipe, RecipeParams } from '../../../features/recipes/models/recipe.interface';

@Component({ template: '' })
export abstract class RecipesData extends TableSearch<Recipe, RecipeParams> {
  protected readonly recipesService = inject(RecipesService);

  protected override paginationData: PaginationData<RecipeParams> = {
    start: 1,
    limit: 12,
  };

  protected override fetchItems(
    params: PaginationData<RecipeParams>
  ): Observable<Recipe[]> {
    return this.recipesService.getAll(params).pipe(
      map(({ data }) => data.map(mapCalories))
    );
  }

  protected override mapResponse(response: Recipe[]): Recipe[] {
    return response;
  }

  protected override buildSearchParams(
    value: string
  ): PaginationData<RecipeParams> {
    const base = resetParams(this.paginationData);
    return setParams(base, {
      name: value,
    });
  }
}
