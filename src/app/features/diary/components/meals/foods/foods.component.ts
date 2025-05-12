import { Component, inject, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { TableDataComponent } from '../../../../../shared/components/table-data/table-data.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { LocalSpinnerComponent } from '../../../../../shared/components/local-spinner/local-spinner.component';
import { MealsService } from '../../../services/meals/meals.service';
import { Meal, MealParams } from '../../../models/meal.interface';
import { PaginationData } from '../../../../../core/models/pagination-data';
import { AddEditMealComponent } from '../add-edit-meal/add-edit-meal.component';
import { mealColumns } from '../../../const/meals.const.const';
import { AddEdit } from '../../../../../core/enums/add-edit.enum';
import { TableSearch } from '../../../../../shared/components/table-search/table-search.component';
import { resetParams, setParams } from '../../../../../core/utils/handle-params';
import { map, Observable } from 'rxjs';
import { mapCalories } from '../../../../../core/utils/map-calories';

@Component({
  selector: 'app-foods',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    TableDataComponent,
    InputComponent,
    LocalSpinnerComponent,
  ],
  templateUrl: './foods.component.html',
  styleUrl: './foods.component.scss',
})
export class FoodsComponent extends TableSearch<Meal, MealParams> {
  private readonly mealsService = inject(MealsService);

  @Input() day!: Date;
  @Input() mealType!: string;

  mealColumns = mealColumns(this.openDetails.bind(this));

  protected override paginationData: PaginationData<MealParams> = {
    start: 1,
    limit: 20,
  };

  protected override fetchItems(params: PaginationData<MealParams>): Observable<Meal[]> {
    return this.mealsService
      .getAll(params)
      .pipe(map(({ data }) => data.map(mapCalories)));
  }

  protected override mapResponse(response: Meal[]): Meal[] {
    return response;
  }

  protected override buildSearchParams(
    value: string
  ): PaginationData<MealParams> {
    const base = resetParams(this.paginationData);
    return setParams(base, {
      food: value,
    });
  }

  openDetails(row: Meal): void {
    this.sidePanelService.openSidePanel(AddEditMealComponent, {
      meal: row,
      day: this.day,
      mealType: this.mealType,
      mode: AddEdit.ADD,
      pageTitle: this.mealType,
    });
  }
}
