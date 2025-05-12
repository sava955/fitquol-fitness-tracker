import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RadialChartComponent } from '../../../../shared/components/radial-chart/radial-chart.component';
import { calculatePercentage } from '../../../../core/utils/calculate-percentage';
import { TodayCalories } from '../../models/dashboard.interface';

@Component({
  selector: 'app-today-calories-statistic',
  imports: [MatIcon, RadialChartComponent],
  templateUrl: './today-calories-statistic.component.html',
  styleUrl: './today-calories-statistic.component.scss',
})
export class TodayCaloriesStatisticComponent {
  @Input() todayCalories!: TodayCalories;

  getPercentageOfTotal(): number {
    return calculatePercentage(
      this.todayCalories.takenCalories - this.todayCalories.burnedCalories,
      this.todayCalories.caloriesRequired
    );
  }
}
