import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AreaChartComponent } from '../../../../shared/components/area-chart/area-chart.component';
import { formatDate } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PeriodFormComponent } from '../period-form/period-form.component';
import { finalize } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseStatisticChartComponent } from '../../../../shared/components/statistic-chart-base/statistic-chart-base.component';
import { CaloriesStatistic, PeriodParams } from '../../models/dashboard.interface';

@Component({
  selector: 'app-calories-statistic',
  imports: [AreaChartComponent, PeriodFormComponent, MatProgressSpinnerModule],
  templateUrl: './calories-statistic.component.html',
  styleUrl: './calories-statistic.component.scss',
})
export class CaloriesStatisticComponent
  extends BaseStatisticChartComponent<CaloriesStatistic>
  implements OnInit
{
  @Output() onPeriodChange = new EventEmitter<string>();

  private readonly dashboardService = inject(DashboardService);
  private readonly destroyRef = inject(DestroyRef);

  private _caloriesStatistic: CaloriesStatistic[] = [];
  @Input() set caloriesStatistic(value: CaloriesStatistic[]) {
    this._caloriesStatistic = value;
    this.setChart(value);
  }
  get caloriesStatistic(): CaloriesStatistic[] {
    return this._caloriesStatistic;
  }

  height = 400;
  fill = ['#0fd895', '#ea7e2b', '#20aff6'];

  ngOnInit(): void {
    this.setChart(this.caloriesStatistic);
  }

  override extractSeries(
    data: CaloriesStatistic[]
  ): { name: string; data: number[] }[] {
    return [
      { name: 'Taken calories', data: data.map((d) => d.takenCalories) },
      { name: 'Burned calories', data: data.map((d) => d.burnedCalories) },
      { name: 'Total calories', data: data.map((d) => d.caloriesBalance) },
    ];
  }

  override formatCategory(item: CaloriesStatistic): string {
    return formatDate(item.date, 'dd/MM/yyyy', 'en-US');
  }

  getCaloriesByPeriod(params?: PeriodParams): void {
    this.loading = true;

    this.dashboardService
      .getAll(params, 'calories-statistic')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => (this.loading = false))
      )
      .subscribe((response) => {
        this.caloriesStatistic = response.data as CaloriesStatistic[];
      });
  }
}
