import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardService } from './services/dashboard.service';
import { LocalSpinnerComponent } from '../../shared/components/local-spinner/local-spinner.component';
import { LocalSpinnerService } from '../../core/services/local-spinner/local-spinner.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { withLocalAppSpinner } from '../../core/utils/with-local-spinner';
import { CaloriesStatisticComponent } from './components/calories-statistic/calories-statistic.component';
import { WeightChartComponent } from '../../shared/components/weight-chart/weight-chart.component';
import { ExercisesStatisticComponent } from './components/exercises-statistic/exercises-statistic.component';
import { TodayMacroStatisticComponent } from './components/today-macro-statistic/today-macro-statistic.component';
import { TodayCaloriesStatisticComponent } from './components/today-calories-statistic/today-calories-statistic.component';
import { Dashboard } from './models/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    LocalSpinnerComponent,
    CaloriesStatisticComponent,
    WeightChartComponent,
    ExercisesStatisticComponent,
    TodayMacroStatisticComponent,
    TodayCaloriesStatisticComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly spinnerService = inject(LocalSpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  dashboard!: Dashboard;

  ngOnInit(): void {
    this.dashboardService
      .getOne()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService)
      )
      .subscribe((response) => {
        this.dashboard = response.data as Dashboard;
        this.dashboardService.startDate.set(this.dashboard.startDate);
      });
  }
}
