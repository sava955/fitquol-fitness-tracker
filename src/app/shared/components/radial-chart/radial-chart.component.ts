import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions } from '../../../core/types/chart-options';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radial-chart',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './radial-chart.component.html',
  styleUrl: './radial-chart.component.scss',
})
export class RadialChartComponent implements OnInit {
  @Input() series!: number[];
  @Input() labels!: string[];
  @Input() fill!: string[];
  @Input() height!: number;

  chartOptions!: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {};
  }

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();
  }

  getChartOptions(): Partial<ChartOptions> {
    return {
      seriesNonAxisSeries: [...this.series],
      chart: {
        height: this.height,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60',
          },
        },
      },
      labels: [...this.labels],
      fill: {
        colors: [...this.fill],
      },
    };
  }
}
