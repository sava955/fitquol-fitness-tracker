import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ExerciseService } from '../../core/services/exercises/exercise.service';
import {
  Exercise,
  ExerciseParams,
} from '../../core/models/exercises/exercise.interface';
import { DsInfiniteScrollDirective } from '../../core/directives/ds-infinite-scroll.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidePanelService } from '../../shared/services/side-panel/side-panel.service';
import { LocalSpinnerService } from '../../shared/services/local-spinner/local-spinner.service';
import { DrawerContentScrollService } from '../../core/services/drawer-content-scroll/drawer-content-scroll.service';
import { exercisesColumns } from '../../core/const/exercises/exercises.const';
import { PaginationData } from '../../core/models/pagination/pagination-data';
import { resetParams, setParams } from '../../shared/utils/handle-params';
import { withLocalAppSpinner } from '../../shared/utils/with-local-spinner';
import { isMoreDataToLoad } from '../../shared/utils/load-data-on-scroll';
import { MatTableModule } from '@angular/material/table';
import { TableDataComponent } from '../../shared/components/table-data/table-data.component';
import { SidePanelComponent } from '../../shared/components/side-panel/side-panel.component';
import { InputBaseComponent } from '../../shared/components/input-base/input-base.component';
import { LocalSpinnerComponent } from '../../shared/components/local-spinner/local-spinner.component';
import { AddEditExerciseComponent } from './add-edit-exercise/add-edit-exercise.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

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
    InputBaseComponent,
    LocalSpinnerComponent,
    PageTitleComponent
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  private readonly exercisesService = inject(ExerciseService);
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

  exercises: Exercise[] = [];
  exercisesColumns = exercisesColumns(this.openDetails.bind(this));

  searchMeal = new FormControl('');

  private readonly paginationData: PaginationData = {
    start: 1,
    limit: 10,
  };

  private params!: ExerciseParams;

  ngOnInit(): void {
    this.params = setParams(this.paginationData);
    this.getExercises();
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
            this.params.start = this.params.start + 1;
          }

          this.getExercises();
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
        this.exercises = [];
        this.params = resetParams();
        this.params = setParams(this.params, { description: value });
        this.getExercises();
      });
  }

  private getExercises(): void {
    this.exercisesService
      .getExercises(this.params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService),
        tap((response) =>
          isMoreDataToLoad(this.drawerContentScrollService, response)
        )
      )
      .subscribe((response) => {
        this.exercises = [...this.exercises, ...response];
      });
  }

  openDetails(row: Exercise): void {
    this.sidePanelService.openSidePanel(AddEditExerciseComponent, {
      data: {
        exercise: {
          sets: 0,
          setDuration: 0,
          caloriesBurned: 0,
          exercise: row,
        },
        day: this.day,
        diary: this.diary,
        mode: 'ADD',
      },
      pageTitle: row.description,
    });
  }

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
