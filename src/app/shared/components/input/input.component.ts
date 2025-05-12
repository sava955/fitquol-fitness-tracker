import {
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

type InputType = 'text' | 'number' | 'email' | 'password';

@Component({
  selector: 'app-input-base',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    ValidationErrorsComponent
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputLabel: string = '';
  @Input() type: InputType = 'text';
  @Input() suffixValue: string = '';
}
