import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActionButtons } from '../../../core/models/action-buttons/action.buttons.interface';

@Component({
  selector: 'app-form-base',
  imports: [ReactiveFormsModule ,MatCardModule, MatButtonModule],
  templateUrl: './form-base.component.html',
  styleUrl: './form-base.component.scss'
})
export class FormBaseComponent {
  @Input() formTitle!: string;
  @Input() formSubtitle!: string;
  @Input() formGroup!: FormGroup;
  @Input() actionBtns!: ActionButtons[];
  @Input() error!: string;
}
