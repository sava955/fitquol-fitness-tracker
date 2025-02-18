import {
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBaseComponent } from '../../../../shared/components/form-base/form-base.component';
import { gender } from '../../../../core/const/user';
import { passwordConfirmationValidator } from '../../../../shared/utils/password-confirmation-validator';
import { ActionButtons } from '../../../../core/models/action-buttons/action.buttons.interface';
import { InputBaseComponent } from '../../../../shared/components/input-base/input-base.component';

@Component({
  selector: 'app-user-data-form',
  imports: [
    InputBaseComponent,
    MatDatepickerModule,
    MatFormField,
    MatInputModule,
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
    FormBaseComponent,
  ],
  templateUrl: './user-data-form.component.html',
  styleUrl: './user-data-form.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class UserDataFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  @Output() onNext = new EventEmitter();

  userData = this.fb.group({
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    dateOfBirth: [null, Validators.required],
    gender: [gender, Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
    passwordConfirmation: [
      null,
      [Validators.required, passwordConfirmationValidator()],
    ],
  });

  get dateOfBirth() {
    return this.userData.get('dateOfBirth');
  }

  actionBtns: ActionButtons[] = [
    {
      label: 'Sign in',
      action: () => this.router.navigateByUrl('login'),
      style: 'secondary',
    },
    {
      label: 'Next',
      action: () => this.onNext.emit(this.userData.value)
    },
  ];

  getMaxDate(): Date {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );
    return maxDate;
  }
}
