import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RadialChartComponent } from '../../../shared/components/radial-chart/radial-chart.component';
import { calculatePercentage } from '../../../shared/utils/calculate-percentage';
import { TodayCalories } from '../../../core/models/dashboard/dashboard.interface';

@Component({
  selector: 'app-today-calories-card',
  imports: [MatIcon, RadialChartComponent],
  templateUrl: './today-calories-card.component.html',
  styleUrl: './today-calories-card.component.scss',
})
export class TodayCaloriesCardComponent {
  @Input() todayCalories!: TodayCalories;

  getPercentageOfTotal(): number {
    return calculatePercentage(
      this.todayCalories.takenCalories - this.todayCalories.burnedCalories,
      this.todayCalories.caloriesRequired
    );
  }
}
