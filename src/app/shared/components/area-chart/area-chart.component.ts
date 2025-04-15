import { Component, Input, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../../core/types/chart-options';

@Component({
  selector: 'app-area-chart',
  imports: [NgApexchartsModule],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss'
})
export class AreaChartComponent implements OnInit {
  @Input() series!: { name: string, data: number[] }[];
  @Input() categories!: string[];
  @Input() height!: number;
  @Input() fill!: string[];

  chartOptions!: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {}
  }

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();
  }

  getChartOptions(): Partial<ChartOptions> {
    return {
      seriesAxisSeries: [...this.series],
      chart: {
        height: this.height,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: [...this.categories]
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
      },
      fill: {
        colors: this.fill,
      },
    };
  }
}
