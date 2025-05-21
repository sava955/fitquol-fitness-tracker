import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserDataFormComponent } from '../../../shared/components/user-data-form/user-data-form.component';
import { UserGoalsFormComponent } from '../../../shared/components/user-goals-form/user-goals-form.component';
import { CdkStepper } from '@angular/cdk/stepper';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PopupSpinnerService } from '../../../core/services/popup-spinner/popup-spinner-service.service';
import {
  User,
  UserData,
  UserGoals,
} from '../../../features/user/models/user.interface';
import { UnitMeasurment } from '../../../features/user/enums/user.enum';
import { withPopupAppSpinner } from '../../../core/utils/with-popup-spinner';
import { LogoComponent } from '../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatStepperModule,
    UserDataFormComponent,
    UserGoalsFormComponent,
    LogoComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly spinnerService = inject(PopupSpinnerService);

  @ViewChild('stepper', { static: true }) stepper!: CdkStepper;

  private registrationData!: User;
  errorMessage!: string;

  nextStep(userData: UserData): void {
    this.registrationData = { ...this.registrationData, ...userData };
    this.stepper.next();
  }

  signUp(goalData: UserGoals): void {
    const data = {
      measurementSystem: goalData.measurementSystem,
      height: goalData.height,
        // goalData.measurementSystem === UnitMeasurment.METRIC
        //   ? goalData.height
        //   : this.getImperialHeight(goalData.heightFeet!, goalData.heightInches!),
      weight: goalData.weight,
      goal: goalData.goal,
      weightPerWeek: goalData.weightPerWeek,
      activityLevel: goalData.activityLevel
    };

    this.registrationData = {
      ...this.registrationData,
      ...data,
    };

    this.authService
      .save(this.registrationData, 'register')
      .pipe(withPopupAppSpinner(this.spinnerService, 'Signing up new user...'))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('login');
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
  }

  getImperialHeight(heightFeet: number, heightInches: number): number {
    const totalFeet = Number(heightFeet) + Number(heightInches) / 12;
    return Math.round(totalFeet * 10) / 10;
  }
}
