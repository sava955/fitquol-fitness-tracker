import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TableDataComponent } from '../../../shared/components/table-data/table-data.component';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import { LocalSpinnerComponent } from '../../../shared/components/local-spinner/local-spinner.component';
import { MealsService } from '../../../core/services/meals/meals.service';
import { SidePanelService } from '../../../shared/services/side-panel/side-panel.service';
import { LocalSpinnerService } from '../../../shared/services/local-spinner/local-spinner.service';
import { DrawerContentScrollService } from '../../../core/services/drawer-content-scroll/drawer-content-scroll.service';
import { Meal, MealParams } from '../../../core/models/meals/meal.interface';
import { PaginationData } from '../../../core/models/pagination/pagination-data';
import { resetParams, setParams } from '../../../shared/utils/handle-params';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { withLocalAppSpinner } from '../../../shared/utils/with-local-spinner';
import { isMoreDataToLoad } from '../../../shared/utils/load-data-on-scroll';
import { AddEditMealComponent } from '../add-edit-meal/add-edit-meal.component';
import { mealColumns } from '../../../core/const/meals/meals.const';
import { AddEdit } from '../../../core/enums/add-edit/add-edit.enum';

@Component({
  selector: 'app-foods',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    TableDataComponent,
    InputBaseComponent,
    LocalSpinnerComponent,
  ],
  templateUrl: './foods.component.html',
  styleUrl: './foods.component.scss',
})
export class FoodsComponent {
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

  private readonly paginationData: PaginationData<MealParams> = {
    start: 1,
    limit: 10,
  };

  private params!: PaginationData<MealParams>;

  ngOnInit(): void {
    this.params = setParams(this.paginationData);
    this.loadMeals();
    this.onSearchEvent();
  }

  private loadMeals(): void {
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
        this.params = resetParams(this.paginationData);
        this.params = setParams(this.params, { food: value! });
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
          isMoreDataToLoad(this.drawerContentScrollService, response, this.params.limit!)
        )
      )
      .subscribe((response) => {
        this.meals = [...this.meals, ...response];
      });
  }

  openDetails(row: Meal): void {
    this.sidePanelService.openSidePanel(AddEditMealComponent, {
      data: {
        meal: row,
        day: this.day,
        mealType: this.mealType,
        mode: AddEdit.ADD,
      },
      pageTitle: this.mealType,
    });
  }
}
