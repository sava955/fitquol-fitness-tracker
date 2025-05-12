import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../../core/types/chart-options';
import {
  NutrientData,
} from '../../../core/models/nutrient.interface';
import { Colors } from '../../../core/enums/colors.enum';
import { Macros } from '../../../core/enums/macros.enum';
import { RadialChartComponent } from '../radial-chart/radial-chart.component';

@Component({
  selector: 'app-macros-chart',
  imports: [NgApexchartsModule, RadialChartComponent],
  templateUrl: './macros-chart.component.html',
  styleUrl: './macros-chart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MacrosChartComponent {
  @Input() height = 200;
  @Input() showGoal = true;
  @Input() shortNames = false;
  @Input() size = '60';
  @Input() showValue = true;
  @Input() nameSize = '14px';
  @Input() nameOffsetY = -10;
  @Input() valueOffsetY = 10;
  @Input() responsive!: ApexResponsive[];
  @Input() fontSm = false;
  @Input() set macro(value: NutrientData) {
    this._macro = value;
  }
  get macro(): NutrientData {
    return this._macro;
  }
  private _macro!: NutrientData;

  chartOptions!: Partial<ChartOptions>;

  getPercentageOfTotal(key: number): number {
    return Math.round(key);
  }

  getMacroColors(key: string): string {
    const colors = [
      { key: Macros.CALORIES, value: Colors.PURPLE },
      { key: Macros.CARBS, value: Colors.GREEN },
      { key: Macros.PROTEIN, value: Colors.BLUE },
      { key: Macros.FATS, value: Colors.ORANGE },
    ];

    const color = colors.find((c) => c.key === key)?.value!;

    return color;
  }

  getShortNames(key: string): string {
    const colors = [
      { key: Macros.CALORIES, value: 'Carbs' },
      { key: Macros.CARBS, value: 'Carbs' },
      { key: Macros.PROTEIN, value: 'Prot' },
      { key: Macros.FATS, value: 'Fats' },
    ];

    const color = colors.find((c) => c.key === key)?.value!;

    return color;
  }
}
