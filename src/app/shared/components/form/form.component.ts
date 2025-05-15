import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActionButtons } from '../../../core/models/action.buttons.interface';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule ,MatCardModule, MatButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  @Input() formTitle!: string;
  @Input() formSubtitle!: string;
  @Input() formGroup!: FormGroup;
  @Input() actionBtns!: ActionButtons[];
  @Input() error!: string;
}
