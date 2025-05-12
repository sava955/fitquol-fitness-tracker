import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatHint } from '@angular/material/form-field';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { MatInput } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-datepicker',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatHint,
    ValidationErrorsComponent,
    MatInput
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
    provideNativeDateAdapter()
  ],
})
export class DatepickerComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputLabel: string = '';
  @Input() min!: Date;
  @Input() max!: Date;
}
