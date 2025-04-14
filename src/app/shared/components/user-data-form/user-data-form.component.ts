import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBaseComponent } from '../form-base/form-base.component';
import { gender } from '../../../core/const/user';
import { passwordConfirmationValidator } from '../../utils/password-confirmation-validator';
import { ActionButtons } from '../../../core/models/action-buttons/action.buttons.interface';
import { InputBaseComponent } from '../input-base/input-base.component';
import { User } from '../../../core/models/user/user.interface';

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
export class UserDataFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  @Input() user!: User;
  @Output() onSubmit = new EventEmitter();

  userData = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    gender: [gender, Validators.required],
    email: ['', Validators.required],
    password: [null, Validators.required],
    passwordConfirmation: [
      null,
      [Validators.required, passwordConfirmationValidator()],
    ],
  });

  get dateOfBirth() {
    return this.userData.get('dateOfBirth');
  }

  actionBtns: ActionButtons[] = [];

  ngOnInit(): void {
    if (this.user) {
      this.setFormData();

      this.actionBtns = [
        {
          label: 'Save',
          action: () => this.onSubmit.emit(this.userData.value)
        },
      ]
    } else {
      this.actionBtns = [
        {
          label: 'Sign in',
          action: () => { this.router.navigateByUrl('login') },
          style: 'secondary',
        },
        {
          label: 'Next',
          action: () => this.onSubmit.emit(this.userData.value)
        },
      ];
    }
  }

  setFormData(): void {
    this.userData.get('firstName')?.setValue(this.user.firstName);
    this.userData.get('lastName')?.setValue(this.user.lastName);
    this.userData.get('dateOfBirth')?.setValue(this.user.dateOfBirth);
    this.userData.get('gender')?.setValue(this.user.gender);
    this.userData.get('email')?.setValue(this.user.email);

    const password = this.userData.get('password');
    const passwordConfirmation = this.userData.get('passwordConfirmation');

    password?.clearValidators();
    passwordConfirmation?.clearValidators();

    password?.updateValueAndValidity();
    passwordConfirmation?.updateValueAndValidity();
  }

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
