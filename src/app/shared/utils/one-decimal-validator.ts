import { AbstractControl, ValidatorFn } from '@angular/forms';

export function oneDecimalValidator(): ValidatorFn {
  return (ctrl: AbstractControl) => {
    if (!ctrl.value) return null;

    const isValid = /^\d+(\.\d{0,1})?$/.test(ctrl.value);
    
    return isValid ? null : { invalidNumberFormat: true };
  };
}