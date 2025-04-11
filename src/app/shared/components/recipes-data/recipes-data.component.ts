import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RecipesService } from '../../../core/services/recipes/recipes.service';
import { LocalSpinnerService } from '../../services/local-spinner/local-spinner.service';
import {
  Recipe,
  RecipeCategory,
  RecipeParams,
} from '../../../core/models/recipes/recipes.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, Observable, tap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { resetParams, setParams } from '../../utils/handle-params';
import { withLocalAppSpinner } from '../../utils/with-local-spinner';
import { isMoreDataToLoad } from '../../utils/load-data-on-scroll';
import { DrawerContentScrollService } from '../../../core/services/drawer-content-scroll/drawer-content-scroll.service';
import { PaginationData } from '../../../core/models/pagination/pagination-data';
import { SidePanelService } from '../../services/side-panel/side-panel.service';

@Component({ template: '' })
export abstract class RecipesData implements OnInit {
  protected readonly recipesService = inject(RecipesService);
  protected readonly spinnerService = inject(LocalSpinnerService);
  protected readonly drawerContentScrollService = inject(
    DrawerContentScrollService
  );
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly sidePanelService = inject(SidePanelService);

  recipes: Recipe[] = [];

  protected params!: PaginationData<RecipeParams>;
  searchRecipe = new FormControl('');

  filteredCategories!: Observable<RecipeCategory[]>;

  protected readonly paginationData: PaginationData<RecipeParams> = {
    start: 1,
    limit: 12,
  };

  ngOnInit(): void {
    this.params = setParams(this.paginationData);
    this.onSearchEvent();
    this.loadRecipes();
  }

  protected onSearchEvent(): void {
    this.searchRecipe.valueChanges
      ?.pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.recipes = [];
        this.params = resetParams(this.paginationData);
        this.params = setParams(this.params, { name: value! });
        this.getRecipes();
      });
  }

  protected loadRecipes(): void {
    this.drawerContentScrollService
      .onLoadMore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((load) => {
        if (load) {
          if (!this.params) {
            this.params = setParams(this.paginationData);
          } else {
            this.params.start = this.params.start! + 1;
          }

          this.getRecipes();
        }
      });
  }

  protected getRecipes(): void {
    this.recipesService
      .getRecipes(this.params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService),
        tap((response) =>
          isMoreDataToLoad(
            this.drawerContentScrollService,
            response,
            this.params.limit!
          )
        )
      )
      .subscribe((response) => {
        this.recipes = [...this.recipes, ...response];
      });
  }
}
