import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Nutrients } from '../../../core/models/nutrient.interface';

@Component({
  selector: 'app-nutrients',
  imports: [MatProgressBarModule, MatButtonModule, MatTooltipModule, MatIcon],
  templateUrl: './nutrients.component.html',
  styleUrl: './nutrients.component.scss'
})
export class NutrientsComponent {
  @Input() data!: Nutrients;
}
