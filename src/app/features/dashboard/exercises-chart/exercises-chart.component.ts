import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AreaChartComponent } from '../../../shared/components/area-chart/area-chart.component';
import { formatDate } from '@angular/common';
import { Calories } from '../../../core/models/dashboard/dashboard.interface';

@Component({
  selector: 'app-exercises-chart',
  imports: [MatCardModule, AreaChartComponent],
  templateUrl: './exercises-chart.component.html',
  styleUrl: './exercises-chart.component.scss',
})
export class ExercisesChartComponent {
  @Input() exercises!: Calories[];

  series!: { name: string; data: number[] }[];
  categories!: string[];
  fill = ['#ea7e2b'];

  ngOnInit(): void {
    this.series = [
      {
        name: 'Burned calories',
        data: this.exercises.map((data: any) => {
          return data.burnedCalories;
        }),
      },
    ];

    this.categories = this.exercises.map((data: any) => {
      return formatDate(data.date, 'dd/MM/yyyy', 'en-US');
    });
  }
}
