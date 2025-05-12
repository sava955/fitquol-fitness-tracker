import { Component, Input } from '@angular/core';
import { User } from '../../../features/user/models/user.interface';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Goal } from '../../../core/models/goal';

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
}
