import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ExerciseService } from '../../services/exercises/exercise.service';
import {
  Exercise,
  ExerciseParams,
} from '../../models/exercise.interface';
import { DsInfiniteScrollDirective } from '../../../../core/directives/ds-infinite-scroll.directive';
import { exercisesColumns } from '../../const/exercises.const';
import { PaginationData } from '../../../../core/models/pagination-data';
import { MatTableModule } from '@angular/material/table';
import { TableDataComponent } from '../../../../shared/components/table-data/table-data.component';
import { SidePanelComponent } from '../../../../shared/components/side-panel/side-panel.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { LocalSpinnerComponent } from '../../../../shared/components/local-spinner/local-spinner.component';
import { AddEditExerciseComponent } from './add-edit-exercise/add-edit-exercise.component';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { TableSearch } from '../../../../shared/components/table-search/table-search.component';
import { resetParams, setParams } from '../../../../core/utils/handle-params';
import { map } from 'rxjs';

@Component({
  selector: 'app-exercises',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    TableDataComponent,
    SidePanelComponent,
    DsInfiniteScrollDirective,
    InputComponent,
    LocalSpinnerComponent,
    PageTitleComponent,
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent extends TableSearch<Exercise, ExerciseParams> {
  private readonly exercisesService = inject(ExerciseService);

  day!: Date;

  exercisesColumns = exercisesColumns(this.openDetails.bind(this));

  protected override paginationData: PaginationData<ExerciseParams> = {
    start: 1,
    limit: 20,
  };

  protected override fetchItems(params: PaginationData<ExerciseParams>) {
    return this.exercisesService.getAll(params).pipe(map(response => response.data));
  }

  protected override mapResponse(response: Exercise[]): Exercise[] {
    return response;
  }

  protected override buildSearchParams(
    value: string
  ): PaginationData<ExerciseParams> {
    const base = resetParams(this.paginationData);
    return setParams(base, {
      description: value,
    });
  }

  openDetails(row: Exercise): void {
    this.sidePanelService.openSidePanel(AddEditExerciseComponent, {
      exercise: {
        sets: 0,
        setDuration: 0,
        caloriesBurned: 0,
        exercise: row,
        day: this.day,
      },
      mode: 'ADD',
      pageTitle: row.description,
    });
  }
}
