import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ChartOptions } from '../../../core/types/chart-options';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radial-chart',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './radial-chart.component.html',
  styleUrl: './radial-chart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RadialChartComponent implements OnInit {
  @Input() series!: number[];
  @Input() labels!: string[];
  @Input() fill!: string[];
  @Input() height!: number;
  @Input() size = '60';
  @Input() showValue = true;
  @Input() nameSize = '14px';
  @Input() nameOffsetY = -10;
  @Input() valueOffsetY = 10;
  @Input() responsive!: ApexResponsive[];

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
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: this.size,
          },
          dataLabels: {
            name: {
              fontSize: this.nameSize,
              offsetY: this.nameOffsetY
            },
            value: {
              show: this.showValue,
              offsetY: this.valueOffsetY
            }
          }
        },
      },
      labels: [...this.labels],
      fill: {
        colors: [...this.fill],
      },
      responsive: this.responsive
    };
  }
}
