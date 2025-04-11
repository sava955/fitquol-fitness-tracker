import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MealsService } from '../../core/services/meals/meals.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TableDataComponent } from '../../shared/components/table-data/table-data.component';
import { SidePanelComponent } from '../../shared/components/side-panel/side-panel.component';
import { SidePanelService } from '../../shared/services/side-panel/side-panel.service';
import { AddEditMealComponent } from './add-edit-meal/add-edit-meal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meal, MealParams } from '../../core/models/meals/meal.interface';
import { mealColumns } from '../../core/const/meals/meals.const';
import { DsInfiniteScrollDirective } from '../../core/directives/ds-infinite-scroll.directive';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { isMoreDataToLoad } from '../../shared/utils/load-data-on-scroll';
import { PaginationData } from '../../core/models/pagination/pagination-data';
import { DrawerContentScrollService } from '../../core/services/drawer-content-scroll/drawer-content-scroll.service';
import { InputBaseComponent } from '../../shared/components/input-base/input-base.component';
import { resetParams, setParams } from '../../shared/utils/handle-params';
import { LocalSpinnerComponent } from '../../shared/components/local-spinner/local-spinner.component';
import { withLocalAppSpinner } from '../../shared/utils/with-local-spinner';
import { LocalSpinnerService } from '../../shared/services/local-spinner/local-spinner.service';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { MatTab, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { FoodsComponent } from './foods/foods.component';
import { RecipesListComponent } from '../recipes/recipes-list/recipes-list.component';
import { RecipesFoodsComponent } from './recipes-foods/recipes-foods.component';

@Component({
  selector: 'app-nutrition',
  imports: [
    SidePanelComponent,
    DsInfiniteScrollDirective,
    PageTitleComponent,
    MatTableModule,
    MatTabsModule,
    FoodsComponent,
    RecipesFoodsComponent
  ],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent {
  private readonly sidePanelService = inject(SidePanelService);
  mealType =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.mealType;

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
