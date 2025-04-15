import { Component, Input, OnInit } from '@angular/core';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { formatDate } from '@angular/common';
import { Goal } from '../../../core/models/goals/goal';

@Component({
  selector: 'app-weight-chart',
  imports: [AreaChartComponent],
  templateUrl: './weight-chart.component.html',
  styleUrl: './weight-chart.component.scss',
})
export class WeightChartComponent implements OnInit {
  @Input() weight!: Goal[];

  series!: { name: string; data: number[] }[];
  categories!: string[];
  fill = ['#20aff6'];

  ngOnInit(): void {
    this.series = [
      {
        name: 'Weight',
        data: this.weight.map((goal: any) => {
          return goal.weight;
        }),
      },
    ];

    this.categories = this.weight.map((goal: any) => {
      return formatDate(goal.fromDate, 'dd/MM/yyyy', 'en-US');
    });
  }
}
