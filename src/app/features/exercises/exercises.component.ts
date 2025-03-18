import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ExerciseService } from '../../core/services/exercises/exercise.service';
import { Exercise, ExerciseParams } from '../../core/models/exercises/exercise.interface';
import { DsInfiniteScrollDirective } from '../../core/directives/ds-infinite-scroll.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ResponseObj } from '../../core/models/http-response/http-response.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardItemComponent } from '../../shared/components/card-item/card-item.component';

@Component({
  selector: 'app-exercises',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    DsInfiniteScrollDirective,
    MatProgressSpinnerModule,
    RouterOutlet,
    CardItemComponent
  ],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.scss',
})
export class ExercisesComponent implements OnInit {
  private params!: ExerciseParams;
  private start!: number;
  private limit!: number;
  exercises: Exercise[] = [];
  loading$ = new BehaviorSubject<boolean>(false);

  searchControl = new FormControl<string>('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly exerciseService = inject(ExerciseService);
  private readonly router = inject(Router);

  private readonly dialog = inject(MatDialog);

  private message!: string;
  private noMoreToLoad: boolean = false;

  private readonly _snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.resetParams();
    this.searchExercises();
  }

  private setLoading(state: boolean): void {
    this.loading$.next(state);
  }

  private resetParams(): void {
    this.start = 0;
    this.limit = 18;
    this.setParams();
  }

  private setParams(extraParams: Partial<ExerciseParams> = {}): void {
    this.params = {
      start: this.start,
      limit: this.limit,
      ...extraParams,
    };
  }

  private getExercises(
    extraParams: Partial<ExerciseParams> = {}
  ): Observable<ResponseObj<Exercise[]>> {
    this.setParams(extraParams);
    return this.exerciseService.getExercises(this.params);
  }

  private searchExercises(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.setLoading(true)),
        switchMap((value) => {
          this.resetParams();
          this.noMoreToLoad = false;

          return this.getExercises({ description: value! }).pipe(
            catchError((error) => {
              if (error.error.title === 'Token invalid') {
                this.router.navigateByUrl('login');
              }
              const errorData = {
                title: error.error.title,
                message: error.error.message,
              };
              this.openDialog(errorData);
              return of([]);
            }),
            finalize(() => this.setLoading(false))
          );
        })
      )
      .subscribe((response: any) => {
        if (response.data.length === 0) {
          this.message = response.message;
          this.noMoreToLoad = true;
          this.openSnackBar(this.message);
        }
        this.exercises = response.data;
      });
  }

  loadMore(scrolled: boolean): void {
    if (!scrolled || this.noMoreToLoad) {
      return;
    }

    this.setLoading(true);
    this.start = this.start + 1;

    this.setParams();
    this.getExercises()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.setLoading(false))
      )
      .subscribe((response) => {
        if (response.data.length === 0) {
          this.message = response.message;
          this.noMoreToLoad = true;
          this.openSnackBar(this.message);
        }
        this.exercises = [...this.exercises, ...response.data];
      });
  }

  private openDialog(data: any): void {
    this.dialog.open(DialogComponent, {
      data: {
        ...data,
      },
      width: '300px',
    });
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'close');
  }

  openDetails(id: string): void {
    this.router.navigateByUrl(`exercises/add-exercise/${id}`)
  }
}
