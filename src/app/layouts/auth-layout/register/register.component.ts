import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserDataFormComponent } from './user-data-form/user-data-form.component';
import { UserGoalsFormComponent } from './user-goals-form/user-goals-form.component';
import { CdkStepper } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SpinnerService } from '../../../shared/services/spinner/spinner-service.service';
import {
  User,
  UserData,
  UserGoals,
} from '../../../core/models/user/user.interface';
import { UnitMeasurment } from '../../../core/enums/user/user.enum';
import { withGlobalAppSpinner } from '../../../shared/utils/with-global-spinner';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatStepperModule,
    UserDataFormComponent,
    UserGoalsFormComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly spinnerService = inject(SpinnerService);
  private readonly dialog = inject(MatDialog);

  @ViewChild('stepper', { static: true }) stepper!: CdkStepper;

  private registrationData!: User;

  nextStep(userData: UserData): void {
    this.registrationData = { ...this.registrationData, ...userData };
    this.stepper.next();
  }

  signUp(goalData: any): void {
    const data: UserGoals = {
      measurementSystem: goalData.measurementSystem,
      height:
        goalData.measurementSystem === UnitMeasurment.METRIC
          ? goalData.height
          : this.getImperialHeight(goalData.heightFeet, goalData.heightInches),
      weight: goalData.weight,
      goal: goalData.goal,
      weightPerWeek: goalData.weightPerWeek,
    };

    this.registrationData = {
      ...this.registrationData,
      ...data,
    };

    this.authService
      .registerUser(this.registrationData)
      .pipe(withGlobalAppSpinner(this.spinnerService, 'Signing up new user...'))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('login');
        },
        error: (err) => {
          this.openDialog(err.error);
        },
      });
  }

  getImperialHeight(heightFeet: number, heightInches: number): number {
    const totalFeet = Number(heightFeet) + Number(heightInches) / 12;
    return Math.round(totalFeet * 10) / 10;
  }

  private openDialog(data: any): void {
    this.dialog.open(DialogComponent, {
      data: {
        ...data,
      },
      width: '300px',
    });
  }
}
