import { Directive, inject, Injector } from '@angular/core';
import {
  FormControl,
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  Validators,
} from '@angular/forms';
import { distinctUntilChanged, map, startWith, Subject, takeUntil, tap } from 'rxjs';

@Directive({
  selector: '[appControlValueAccessor]',
})
export class ControlValueAccessorDirective<T> {
  private readonly injector = inject(Injector);

  control: FormControl | undefined;
  isRequired = false;

  private _isDisabled = false;
  private _destroy$ = new Subject<void>();
  private _onTouched!: () => T;

  ngOnInit(): void {
    this.setFormControl();
    this.isRequired = this.control?.hasValidator(Validators.required) ?? false;
  }

  setFormControl() {
    try {
      const formControl = this.injector.get(NgControl);

      switch (formControl.constructor) {
        case FormControlName:
          this.control = this.injector
            .get(FormGroupDirective)
            .getControl(formControl as FormControlName);
          break;
        default:
          this.control = (formControl as FormControlDirective)
            .form as FormControl;
          break;
      }
    } catch (err) {
      this.control = new FormControl();
    }
  }

  writeValue(value: T): void {
    if (!this.control) {
      this.control = new FormControl(value);
    }
  }

  registerOnChange(fn: (val: T | null) => T): void {
    this.control?.valueChanges
      .pipe(
        takeUntil(this._destroy$),
        startWith(this.control.value),
        distinctUntilChanged(),
        tap(val => fn(val)) 
      )
      .subscribe(() => {
        this.control?.markAsUntouched()
      });
  }

  registerOnTouched(fn: () => T): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
  }
}
