import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ControlValueAccessorDirective } from '../../directives/control-value-accessor.directive';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SelectOptions } from '../../../core/models/select-base/selet-options.interface';
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
    MatError
  ],
  templateUrl: './autocomplete-base.component.html',
  styleUrl: './autocomplete-base.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteBaseComponent),
      multi: true,
    },
  ],
})
export class AutocompleteBaseComponent<
  T
> extends ControlValueAccessorDirective<T> {
  @Input() options!: Observable<any[]>;
  @Input() inputLabel: string = '';
  @Input() suffixValue: string = '';
  
  @Output() optionSelected = new EventEmitter<any>();

  displayFn(item?: any): string {
    return item ? item.name : '';
  }

  selectOption(event: any): void {
    this.optionSelected.emit(event);
  }
}
