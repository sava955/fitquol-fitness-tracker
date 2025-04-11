import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputBaseComponent } from '../../../../shared/components/input-base/input-base.component';
import { FormBaseComponent } from '../../../../shared/components/form-base/form-base.component';
import { goal, measurementSystem } from '../../../../core/const/user';
import { oneDecimalValidator } from '../../../../shared/utils/one-decimal-validator';
import { ActionButtons } from '../../../../core/models/action-buttons/action.buttons.interface';
import {
  ActivityLevel,
  UnitMeasurment,
} from '../../../../core/enums/user/user.enum';
import { SelectBaseComponent } from '../../../../shared/components/select-base/select-base.component';
import { SelectOptions } from '../../../../core/models/select-base/selet-options.interface';

@Component({
  selector: 'app-user-goals-form',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    InputBaseComponent,
    ReactiveFormsModule,
    FormBaseComponent,
    SelectBaseComponent
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
    activityLevel: [null, Validators.required],
  });

  weightOptionsKg: SelectOptions[] = [
    { label: '0.5', value: 0.5 },
    { label: '1', value: 1 }];

  weightOptions: SelectOptions[] = [...this.weightOptionsKg];

  activityLevelOptions: SelectOptions[] = [
    { value: ActivityLevel.SEDENTARY, label: 'Sedentary' },
    { value: ActivityLevel.LIGHTLY_ACTIVE, label: 'Lightly active' },
    { value: ActivityLevel.MODERATELY_ACTIVE, label: 'Moderately active' },
    { value: ActivityLevel.VERY_ACTIVE, label: 'Very active' },
    { value: ActivityLevel.SUPER_ACTIVE, label: 'Super active' },
  ];

  actionBtns: ActionButtons[] = [
    {
      label: 'Back',
      action: () => this.onBack.emit(),
      style: 'secondary',
    },
    {
      label: 'Sign up',
      action: () => this.signUp(),
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
        ? this.weightOptionsKg.map((option) => ({
          label: this.convertKgToPounds(Number(option.label)).toFixed(),
          value: this.convertKgToPounds(Number(option.value))}))
        : [...this.weightOptionsKg];
  }

  private signUp(): void {
    if (this.userGoals.invalid) {
      return this.userGoals.markAllAsTouched();
    }

    this.onSignUp.emit(this.userGoals.value);
  }
}
