import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Diary } from '../../models/diary.interface';

@Component({
  selector: 'app-calories-balance',
  imports: [MatCardModule],
  templateUrl: './calories-balance.component.html',
  styleUrl: './calories-balance.component.scss'
})
export class CaloriesBalanceComponent {
  @Input() diary!: Diary;
  @Input() caloriesRequired!: number;
}
