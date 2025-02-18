import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import {
  MatFormField,
  MatHint,
  MatLabel,
  MatOption,
  MatSelect,
} from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputBaseComponent } from '../../../../shared/components/input-base/input-base.component';
import { FormBaseComponent } from '../../../../shared/components/form-base/form-base.component';
import { goal, measurementSystem } from '../../../../core/const/user';
import { oneDecimalValidator } from '../../../../shared/utils/one-decimal-validator';
import { ActionButtons } from '../../../../core/models/action-buttons/action.buttons.interface';
import { UnitMeasurment } from '../../../../core/enums/user/user.enum';

@Component({
  selector: 'app-user-goals-form',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    MatSelect,
    MatHint,
    InputBaseComponent,
    MatFormField,
    MatOption,
    MatLabel,
    ReactiveFormsModule,
    FormBaseComponent,
  ],
  templateUrl: './user-goals-form.component.html',
  styleUrl: './user-goals-form.component.scss',
})
export class UserGoalsFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Output() onBack = new EventEmitter();
  @Output() onSignUp = new EventEmitter<any>();

  userGoals = this.fb.group({
    measurementSystem: [measurementSystem, Validators.required],
    height: [null, [Validators.required, Validators.max(300)]],
    heightFeet: [null, [Validators.max(10)]],
    heightInches: [null, [Validators.max(11)]],
    weight: [
      null,
      [Validators.required, Validators.max(999), oneDecimalValidator()],
    ],
    goal: [goal, Validators.required],
    weightPerWeek: [null, Validators.required],
  });

  weightOptionsKg = [0.5, 1, 1.5, 2];
  weightOptions: number[] = [...this.weightOptionsKg];

  weightPerWeekWarningMessage = signal<string | null>(null);

  actionBtns: ActionButtons[] = [
    {
      label: 'Back',
      action: () => this.onBack.emit(),
      style: 'secondary',
    },
    {
      label: 'Sign up',
      action: () => this.signUp()
    },
  ];

  get measurementSystem() {
    return this.userGoals.get('measurementSystem');
  }

  get height() {
    return this.userGoals.get('height');
  }

  get heightFeet() {
    return this.userGoals.get('heightFeet');
  }

  get heightInches() {
    return this.userGoals.get('heightInches');
  }

  get weight() {
    return this.userGoals.get('weight');
  }

  get goal() {
    return this.userGoals.get('goal');
  }

  get weightPerWeek() {
    return this.userGoals.get('weightPerWeek');
  }

  ngOnInit(): void {
    this.measurementSystem?.valueChanges.subscribe((system) => {
      if (system === UnitMeasurment.METRIC) {
        if (this.heightFeet?.value && this.heightInches?.value) {
          const metricValue: any = this.convertImperialToCm(
            this.heightFeet?.value,
            this.heightInches?.value
          );

          this.userGoals.patchValue({
            height: metricValue,
          });
        }

        if (this.weight?.value) {
          const metricValue: any = this.convertPoundsToKg(this.weight?.value);

          this.weight.patchValue(metricValue);
        }

        if (this.weightPerWeek?.value) {
          const metricValue: any = this.convertPoundsToKg(
            this.weightPerWeek?.value
          );

          this.weightPerWeek.patchValue(metricValue);

          if (this.weightPerWeek?.value > 1) {
            this.weightPerWeekWarningMessage.set(
              'It is not healthy to lose more the 1 kg per week'
            );
          }
        }

        this.heightFeet?.clearValidators();
        this.heightInches?.clearValidators();
        this.height?.setValidators([Validators.required, Validators.max(999)]);
      } else {
        if (this.height?.value) {
          const imperialValue: any = this.convertCmToImperial(
            this.height?.value
          );

          this.userGoals.patchValue({
            heightFeet: imperialValue.feet,
            heightInches: imperialValue.inches,
          });
        }

        if (this.weight?.value) {
          const imperialValue: any = this.convertKgToPounds(this.weight?.value);

          this.weight.patchValue(imperialValue);
        }

        if (this.weightPerWeek?.value) {
          const imperialValue: any = this.convertKgToPounds(
            this.weightPerWeek?.value
          );

          this.weightPerWeek.patchValue(imperialValue);

          if (this.weightPerWeek?.value > 2.2) {
            this.weightPerWeekWarningMessage.set(
              'It is not healthy to lose more the 2 lbs per week'
            );
          }
        }

        this.heightFeet?.setValidators([
          Validators.required,
          Validators.max(10),
        ]);
        this.heightInches?.setValidators([
          Validators.required,
          Validators.max(10),
        ]);
        this.height?.clearValidators();
      }

      this.heightFeet?.updateValueAndValidity();
      this.heightInches?.updateValueAndValidity();
      this.height?.updateValueAndValidity();
      this.updateWeightOptions(system!);
    });

    this.weightPerWeek?.valueChanges.subscribe((value: any) => {
      if (this.measurementSystem?.value === UnitMeasurment.METRIC && value > 1) {
        this.weightPerWeekWarningMessage.set(
          'It is not healthy to lose more the 1 kg per week'
        );
      } else if (this.measurementSystem?.value === UnitMeasurment.IMPERIAL && value > 2.2) {
        this.weightPerWeekWarningMessage.set(
          'It is not healthy to lose more the 2 lbs per week'
        );
      } else {
        this.weightPerWeekWarningMessage.set(null);
      }
    });
  }

  private convertImperialToCm(feet: number, inches: number) {
    return Math.round((feet * 12 + inches) * 2.54);
  }

  private convertCmToImperial(cm: number) {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  }

  private convertKgToPounds(kg: number): number {
    return Math.round(kg * 2.20462 * 10) / 10;
  }

  private convertPoundsToKg(pounds: number): number {
    return Math.round((pounds / 2.20462) * 10) / 10;
  }

  private updateWeightOptions(system: string) {
    this.weightOptions =
      system === UnitMeasurment.IMPERIAL
        ? this.weightOptionsKg.map((kg) => this.convertKgToPounds(kg))
        : [...this.weightOptionsKg];
  }

  private signUp(): void {
    if (this.userGoals.invalid) {
      return this.userGoals.markAllAsTouched();
    }

    this.onSignUp.emit(this.userGoals.value)
  }
}
