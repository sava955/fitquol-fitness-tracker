import { CommonModule} from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashobardService } from '../../core/services/dashboard/dashobard.service';
import { LocalSpinnerComponent } from '../../shared/components/local-spinner/local-spinner.component';
import { LocalSpinnerService } from '../../shared/services/local-spinner/local-spinner.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { withLocalAppSpinner } from '../../shared/utils/with-local-spinner';
import { CaloriesBalanceComponent } from './calories-balance/calories-balance.component';
import { WeightChartComponent } from '../../shared/components/weight-chart/weight-chart.component';
import { ExercisesChartComponent } from './exercises-chart/exercises-chart.component';
import { TodayMacroCardComponent } from './today-macro-card/today-macro-card.component';
import { TodayCaloriesCardComponent } from "./today-calories-card/today-calories-card.component";
import { Dashboard } from '../../core/models/dashboard/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    LocalSpinnerComponent,
    CaloriesBalanceComponent,
    WeightChartComponent,
    ExercisesChartComponent,
    TodayMacroCardComponent,
    TodayCaloriesCardComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashobardService);
  private readonly spinnerService = inject(LocalSpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  dashboard!: Dashboard;

  ngOnInit(): void {
    this.dashboardService
      .getDashboard()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService)
      )
      .subscribe((response) => {
        console.log(response);
        this.dashboard = response;
      });
  }
}
