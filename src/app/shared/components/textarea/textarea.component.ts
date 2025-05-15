import { TextFieldModule } from '@angular/cdk/text-field';
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-textarea-base',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    TextFieldModule,
    MatInput,
    ValidationErrorsComponent,
    MatError,
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent<T> extends ControlValueAccessorDirective<T> {
  @Input() inputLabel: string = '';
}
