import { Component, Input } from '@angular/core';
import { RadialChartComponent } from '../../../shared/components/radial-chart/radial-chart.component';
import { NutrientData } from '../../../core/models/nutrients/nutrient.interface';

@Component({
  selector: 'app-today-macro-card',
  imports: [RadialChartComponent],
  templateUrl: './today-macro-card.component.html',
  styleUrl: './today-macro-card.component.scss',
})
export class TodayMacroCardComponent {
  @Input() todayMacros!: NutrientData[];

  getPercentageOfTotal(key: number): number {
    return Math.round(key);
  }

  getMacroColors(key: string): string {
    const colors = [
      { key: 'carbohydrates', value: '#0fd895' },
      { key: 'protein', value: '#ea7e2b' },
      { key: 'fats', value: '#d80f5c' },
    ];

    const color = colors.find((c) => c.key === key)?.value!;

    return color;
  }
}
