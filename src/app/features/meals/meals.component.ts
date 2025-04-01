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

@Component({
  selector: 'app-nutrition',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    TableDataComponent,
    SidePanelComponent,
    DsInfiniteScrollDirective,
    InputBaseComponent,
    LocalSpinnerComponent,
    PageTitleComponent
  ],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent implements OnInit {
  private readonly mealsService = inject(MealsService);
  private readonly sidePanelService = inject(SidePanelService);
  private readonly spinnerService = inject(LocalSpinnerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly drawerContentScrollService = inject(
    DrawerContentScrollService
  );

  day =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.day;
  mealType =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.mealType;
  diary =
    this.sidePanelService.drawerStack()[
      this.sidePanelService.drawerStack().length - 1
    ]?.data.data?.diary;

  meals: Meal[] = [];
  mealColumns = mealColumns(this.openDetails.bind(this));

  searchMeal = new FormControl('');

  private readonly paginationData: PaginationData = {
    start: 1,
    limit: 10,
  };

  private params!: MealParams;

  ngOnInit(): void {
    this.params = setParams(this.paginationData);
    this.getMeals();
    this.loadMeals();
    this.onSearchEvent();
  }

  private loadMeals(): void {
    this.drawerContentScrollService.onLoadMore().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((load) => {
      if (load) {
        if (!this.params) {
          this.params = setParams(this.paginationData);
        } else {
          this.params.start = this.params.start + 1;
        }

        this.getMeals();
      }
    });
  }

  private onSearchEvent(): void {
    this.searchMeal.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.meals = [];
        this.params = resetParams();
        this.params = setParams(this.params, { food: value });
        this.getMeals();
      });
  }

  private getMeals(): void {
    this.mealsService
      .getMeals(this.params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService),
        tap((response) =>
          isMoreDataToLoad(this.drawerContentScrollService, response)
        )
      )
      .subscribe((response) => {
        this.meals = [...this.meals, ...response];
      });
  }

  openDetails(row: Meal): void {
    this.sidePanelService.openSidePanel(AddEditMealComponent, {
      data: {
        id: row._id,
        day: this.day,
        mealType: this.mealType,
        diary: this.diary,
        mode: 'ADD',
      },
      pageTitle: row.name,
    });
  }

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
