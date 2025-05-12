import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../../core/types/chart-options';

@Component({
  selector: 'app-area-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss',
})
export class AreaChartComponent implements OnInit, OnChanges {
  @Input() series: { name: string; data: number[] }[] = [];
  @Input() categories: string[] = [];
  @Input() height = 350;
  @Input() fill: string[] = [];

  chartOptions!: Partial<ChartOptions>;

  ngOnInit(): void {
    this.updateChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['series'] ||
      changes['categories'] ||
      changes['height'] ||
      changes['fill']
    ) {
      this.updateChartOptions();
    }
  }

  private updateChartOptions(): void {
    this.chartOptions = {
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
        categories: [...this.categories],
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy',
        },
      },
      fill: {
        colors: [...this.fill],
      },
    };
  }
}
