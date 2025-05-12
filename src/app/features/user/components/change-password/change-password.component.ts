import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormComponent } from '../../../../shared/components/form/form.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { passwordConfirmationValidator } from '../../../../core/utils/password-confirmation-validator';
import { ActionButtons } from '../../../../core/models/action.buttons.interface';
import { PasswordRequest } from '../../models/user.interface';

@Component({
  selector: 'app-change-password',
  imports: [FormComponent, ReactiveFormsModule, InputComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);

  @Output() onSubmit = new EventEmitter<PasswordRequest>();

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    password: ['', Validators.required],
    passwordConfirmation: [
      '',
      [Validators.required, passwordConfirmationValidator],
    ],
  });

  actionBtns: ActionButtons[] = [
    {
      label: 'Save',
      action: () => this.submit(),
    },
  ];

  submit(): void {
    const payload = {
      currentPassword: this.passwordForm.value.currentPassword!,
      password: this.passwordForm.value.password!,
      passwordConfirmation: this.passwordForm.value.passwordConfirmation!,
    };

    this.onSubmit.emit(payload);
  }
}
