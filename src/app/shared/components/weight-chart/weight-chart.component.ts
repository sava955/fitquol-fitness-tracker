import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { formatDate } from '@angular/common';
import { Goal } from '../../../core/models/goal';
import { MatButtonModule } from '@angular/material/button';
import { DashboardService } from '../../../features/dashboard/services/dashboard.service';
import { MatIcon } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseStatisticChartComponent } from '../statistic-chart-base/statistic-chart-base.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UnitMeasurment } from '../../../features/user/enums/user.enum';
import { convertKgToPounds } from '../../../core/utils/get-by-measurment-system';

@Component({
  selector: 'app-weight-chart',
  imports: [
    AreaChartComponent,
    MatButtonModule,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  templateUrl: './weight-chart.component.html',
  styleUrl: './weight-chart.component.scss',
})
export class WeightChartComponent
  extends BaseStatisticChartComponent<Goal>
  implements OnInit
{
  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  @Input() set weightStatistic(value: Goal[]) {
    this._weightStatistic = value;
    this.setChart(value);
  }
  get weightStatistic(): Goal[] {
    return this._weightStatistic;
  }
  private _weightStatistic: Goal[] = [];

  fill = ['#20aff6'];
  limit = 5;

  ngOnInit(): void {
    this.setChart(this.weightStatistic);
  }

  override extractSeries(data: Goal[]): { name: string; data: number[] }[] {
    return [
      {
        name: 'Weight',
        data: data.map((goal) =>
          goal.measurementSystem === UnitMeasurment.METRIC
            ? goal.weight
            : convertKgToPounds(goal.weight)
        ),
      },
    ];
  }

  override formatCategory(goal: Goal): string {
    return formatDate(goal.fromDate, 'dd/MM/yyyy', 'en-US');
  }

  loadMore(): void {
    this.loading = true;
    this.limit += 5;

    this.dashboardService
      .getAll({ limit: this.limit }, 'weight-statistic')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.weightStatistic = response.data as Goal[];
        this.loading = false;
      });
  }
}
