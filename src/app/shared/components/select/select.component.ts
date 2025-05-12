import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { MatOption, MatSelect } from '@angular/material/select';
import { SelectOptions } from '../../../core/models/selet-options.interface';

@Component({
  selector: 'app-select-base',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelect,
    MatOption,
    ValidationErrorsComponent
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() options: SelectOptions[] = [];
  @Input() inputLabel: string = '';
  @Input() suffixValue: string = '';
}
