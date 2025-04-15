import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AreaChartComponent } from '../../../shared/components/area-chart/area-chart.component';
import { formatDate } from '@angular/common';
import { Calories } from '../../../core/models/dashboard/dashboard.interface';

@Component({
  selector: 'app-calories-balance',
  imports: [MatCardModule, AreaChartComponent],
  templateUrl: './calories-balance.component.html',
  styleUrl: './calories-balance.component.scss',
})
export class CaloriesBalanceComponent implements OnInit {
  @Input() calories!: Calories[];

  series!: { name: string, data: number[] }[];
  categories!: string[];
  height = 400;
  fill = ['#0fd895', '#ea7e2b', '#20aff6'];

  ngOnInit(): void {
    this.series = [
      {
        name: 'Taken calories',
        data: this.calories.map((data: any) => {
          return data.takenCalories;
        }),
      },
      {
        name: 'Burned calories',
        data: this.calories.map((data: any) => {
          return data.burnedCalories;
        }),
      },
      {
        name: 'Total calories',
        data: this.calories.map((data: any) => {
          return data.caloriesBalance;
        }),
      },
    ];

    this.categories = this.calories.map((data: any) => {
      return formatDate(data.date, 'dd/MM/yyyy', 'en-US');
    });
  }
}
