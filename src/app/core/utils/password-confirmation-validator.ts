import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordConfirmationValidator(
): ValidatorFn {
  return (ctrl: AbstractControl) => {
    const password = ctrl.parent?.get('password')?.value;
    const confirmedPassword = ctrl.value;

    if (password && confirmedPassword && password !== confirmedPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
