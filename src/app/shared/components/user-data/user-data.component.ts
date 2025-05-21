import { Component, Input } from '@angular/core';
import { User } from '../../../features/user/models/user.interface';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Goal } from '../../../core/models/goal';
import { convertCmToImperial, convertKgToPounds } from '../../../core/utils/get-by-measurment-system';
import { UnitMeasurment } from '../../../features/user/enums/user.enum';

@Component({
  selector: 'app-user-data',
  imports: [CommonModule ,MatIcon],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.scss'
})
export class UserDataComponent {
  @Input() user!: User;
  @Input() goal!: Goal;
  
  formatGoal(goal: string): string {
    if (goal === 'LOSE_WEIGHT') {
      return 'Lose weight';
    } else if (goal === 'GAIN_WEIGHT') {
      return 'Gain weight';
    } else {
      return 'Remain weight';
    }
  }

  isMetric(): boolean {
    return this.goal.measurementSystem === UnitMeasurment.METRIC;
  }

  getImperialHeight(): string {
    const height = convertCmToImperial(this.goal.height);
    const value = height.feet + ' ft ' + height.inches + "''";
    return value;
  }

  getImperialWeight(weight: number): number {
    return convertKgToPounds(weight);
  }
}
