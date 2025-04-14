import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBaseComponent } from '../../../shared/components/form-base/form-base.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputBaseComponent } from '../../../shared/components/input-base/input-base.component';
import { passwordConfirmationValidator } from '../../../shared/utils/password-confirmation-validator';
import { ActionButtons } from '../../../core/models/action-buttons/action.buttons.interface';
import { PasswordRequest } from '../../../core/models/user/user.interface';

@Component({
  selector: 'app-change-password',
  imports: [FormBaseComponent, ReactiveFormsModule, InputBaseComponent],
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
    const payload: PasswordRequest = {
      currentPassword: this.passwordForm.value.currentPassword!,
      password: this.passwordForm.value.password!,
      passwordConfirmation: this.passwordForm.value.passwordConfirmation!,
    };

    this.onSubmit.emit(payload);
  }
}
