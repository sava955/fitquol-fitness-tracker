import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-input-base',
  imports: [ReactiveFormsModule, MatLabel, MatFormField, MatInput, MatError, MatSuffix, MatHint],
  templateUrl: './input-base.component.html',
  styleUrl: './input-base.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputBaseComponent),
      multi: true,
    },
  ]
})
export class InputBaseComponent implements ControlValueAccessor {
  @Input() inputLabel!: string;
  @Input() type: string = 'text';
  @Input() step!: string;
  @Input() suffixValue: string = '';
  @Input() warning: string = '';

  @Input() formControl = new FormControl();

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    // this.formControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    // this.onChange = fn;
    // this.formControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    // this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    /*if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }*/
  }
}
