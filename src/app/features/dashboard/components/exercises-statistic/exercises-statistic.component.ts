import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AreaChartComponent } from '../../../../shared/components/area-chart/area-chart.component';
import { formatDate } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PeriodFormComponent } from '../period-form/period-form.component';
import { BaseStatisticChartComponent } from '../../../../shared/components/statistic-chart-base/statistic-chart-base.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ExercisesStatistic, PeriodParams } from '../../models/dashboard.interface';

@Component({
  selector: 'app-exercises-statistic',
  imports: [
    MatCardModule,
    AreaChartComponent,
    PeriodFormComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './exercises-statistic.component.html',
  styleUrl: './exercises-statistic.component.scss',
})
export class ExercisesStatisticComponent
  extends BaseStatisticChartComponent<ExercisesStatistic>
  implements OnInit
{
  @Input() set exercisesStatistic(value: ExercisesStatistic[]) {
    this._exercisesStatistic = value;
    this.setChart(value);
  }
  get exercisesStatistic(): ExercisesStatistic[] {
    return this._exercisesStatistic;
  }
  private _exercisesStatistic: ExercisesStatistic[] = [];

  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  fill = ['#ea7e2b', '#20aff6'];

  ngOnInit(): void {
    this.setChart(this.exercisesStatistic);
  }

  override extractSeries(
    data: ExercisesStatistic[]
  ): { name: string; data: number[] }[] {
    return [
      {
        name: 'Burned calories',
        data: data.map((item) => item.burnedCalories),
      },
      {
        name: 'Minutes per day',
        data: data.map((item) => item.durationSum),
      },
    ];
  }

  override formatCategory(item: ExercisesStatistic): string {
    return formatDate(item.date, 'dd/MM/yyyy', 'en-US');
  }

  getExercisesByPeriod(params?: PeriodParams): void {
    this.loading = true;

    this.dashboardService
      .getAll(params, 'exercises-statistic')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.exercisesStatistic = response.data as ExercisesStatistic[];
        this.loading = false;
      });
  }
}
