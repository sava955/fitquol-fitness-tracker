import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ValidationErrorsComponent } from '../validation-errors/validation-errors.component';

@Component({
  selector: 'app-autocomplete-base',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    ValidationErrorsComponent,
    MatError,
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true,
    },
  ],
})
export class AutocompleteComponent<
  T extends object,
  K extends keyof T = keyof T
> extends ControlValueAccessorDirective<T> {
  @Input() options!: Observable<T[]>;
  @Input() key!: K;
  @Input() inputLabel: string = '';
  @Input() suffixValue: string = '';
  
  @Output() optionSelected = new EventEmitter<T>();

  displayFn(item?: T): string {
    return item && this.key && item[this.key] != null
    ? String(item[this.key])
    : '';
  }

  selectOption(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value as T;
    this.optionSelected.emit(selectedValue);
  }
}
