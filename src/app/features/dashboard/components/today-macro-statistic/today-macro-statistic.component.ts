import { Component, Input } from '@angular/core';
import { NutrientData } from '../../../../core/models/nutrient.interface';
import { Colors } from '../../../../core/enums/colors.enum';
import { Macros } from '../../../../core/enums/macros.enum';
import { MacrosChartComponent } from '../../../../shared/components/macros-chart/macros-chart.component';
import { todayMacrosResponsiveChart } from '../../../../core/const/today-macros-responsive-chart';

@Component({
  selector: 'app-today-macro-statistic',
  imports: [MacrosChartComponent],
  templateUrl: './today-macro-statistic.component.html',
  styleUrl: './today-macro-statistic.component.scss',
})
export class TodayMacroStatisticComponent {
  @Input() todayMacros!: NutrientData[];
  responsive = todayMacrosResponsiveChart;

  getPercentageOfTotal(key: number): number {
    return Math.round(key);
  }

  getMacroColors(key: string): string {
    const colors = [
      { key: Macros.CARBS, value: Colors.GREEN },
      { key: Macros.PROTEIN, value: Colors.BLUE },
      { key: Macros.FATS, value: Colors.ORANGE },
    ];

    const color = colors.find((c) => c.key === key)?.value!;

    return color;
  }
}
