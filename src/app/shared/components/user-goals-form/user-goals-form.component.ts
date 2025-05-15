import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { FormComponent } from '../form/form.component';
import { oneDecimalValidator } from '../../../core/utils/one-decimal-validator';
import { ActionButtons } from '../../../core/models/action.buttons.interface';
import {
  ActivityLevel,
  UnitMeasurment,
} from '../../../features/user/enums/user.enum';
import { SelectComponent } from '../select/select.component';
import { SelectOptions } from '../../../core/models/selet-options.interface';
import { MatInputModule } from '@angular/material/input';
import { Goal } from '../../../core/models/goal';
import { distinctUntilChanged } from 'rxjs';
import { getGoalByDate } from '../../../core/utils/get-goal-by-date';
import { UserGoals } from '../../../features/user/models/user.interface';
import { goal, measurementSystem } from '../../../features/user/const/user.const';
import { DatepickerComponent } from '../datepicker/datepicker.component';

@Component({
  selector: 'app-user-goals-form',
  imports: [
    MatRadioGroup,
    MatRadioButton,
    InputComponent,
    ReactiveFormsModule,
    FormComponent,
    SelectComponent,
    MatInputModule,
    DatepickerComponent
  ],
  templateUrl: './user-goals-form.component.html',
  styleUrl: './user-goals-form.component.scss'
})
export class UserGoalsFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Input() goals!: Goal[];
  @Input() errorMessage!: string;

  @Output() onBack = new EventEmitter();
  @Output() onSubmit = new EventEmitter<UserGoals>();

  currentGoal!: Goal;

  userGoals = this.fb.group({
    date: [new Date(), [Validators.required]],
    measurementSystem: [measurementSystem, Validators.required],
    height: ['', [Validators.required, Validators.max(300)]],
    heightFeet: ['', [Validators.max(10)]],
    heightInches: ['', [Validators.max(11)]],
    weight: [
      '',
      [Validators.required, Validators.max(999), oneDecimalValidator()],
    ],
    goal: [goal, Validators.required],
    weightPerWeek: ['', Validators.required],
    activityLevel: ['', Validators.required],
  });

  weightOptionsKg: SelectOptions[] = [
    { label: '0.5', value: '0.5' },
    { label: '1', value: '1' },
  ];

  weightOptions: SelectOptions[] = [...this.weightOptionsKg];

  activityLevelOptions: SelectOptions[] = [
    { value: ActivityLevel.SEDENTARY, label: 'Sedentary' },
    { value: ActivityLevel.LIGHTLY_ACTIVE, label: 'Lightly active' },
    { value: ActivityLevel.MODERATELY_ACTIVE, label: 'Moderately active' },
    { value: ActivityLevel.VERY_ACTIVE, label: 'Very active' },
    { value: ActivityLevel.SUPER_ACTIVE, label: 'Super active' },
  ];

  actionBtns!: ActionButtons[];

  get date() {
    return this.userGoals.get('date');
  }

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
    if (this.goals) {
      this.currentGoal = this.goals[0];
      this.setFormData();

      this.actionBtns = [
        {
          label: 'Save',
          action: () => this.submit(),
        },
      ];
    } else {
      this.actionBtns = [
        {
          label: 'Back',
          action: () => this.onBack.emit(),
          style: 'secondary',
        },
        {
          label: 'Sign up',
          action: () => this.submit(),
        },
      ];

      this.date?.clearValidators();
      this.date?.updateValueAndValidity();
    }
    this.onFormEvent();
  }

  private onFormEvent(): void {
    if (this.goals) {
      this.date?.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((value) => {
          if (value) {
            this.currentGoal =
              getGoalByDate(this.goals, value) ?? this.goals[0];
          }

          this.setFormData();
        });
    }

    this.measurementSystem?.valueChanges.subscribe((system) => {
      if (system === UnitMeasurment.METRIC) {
        if (this.heightFeet?.value && this.heightInches?.value) {
          const heightFeetValue = Number(this.heightFeet.value);
          const heightInchesValue = Number(this.heightInches.value);

          const metricValue = this.convertImperialToCm(
            heightFeetValue,
            heightInchesValue
          );

          this.userGoals.patchValue({
            height: metricValue.toString(),
          });
        }

        if (this.weight?.value) {
          const weightValue = Number(this.weight.value);
          const metricValue = this.convertPoundsToKg(weightValue);

          this.weight.patchValue(metricValue.toString());
        }

        if (this.weightPerWeek?.value) {
          const weightPerWeekValue = Number(this.weightPerWeek?.value);
          const metricValue = this.convertPoundsToKg(weightPerWeekValue);

          this.weightPerWeek.patchValue(metricValue.toString());
        }

        this.heightFeet?.clearValidators();
        this.heightInches?.clearValidators();
        this.height?.setValidators([Validators.required, Validators.max(999)]);
      } else {
        if (this.height?.value) {
          const heightValue = Number(this.height.value);
          const imperialValue = this.convertCmToImperial(heightValue);

          this.userGoals.patchValue({
            heightFeet: imperialValue.feet.toString(),
            heightInches: imperialValue.inches.toString(),
          });
        }

        if (this.weight?.value) {
          const weightValue = Number(this.weight.value);
          const imperialValue = this.convertKgToPounds(weightValue);

          this.weight.patchValue(imperialValue.toString());
        }

        if (this.weightPerWeek?.value) {
          const weightPerWeekValue = Number(this.weightPerWeek?.value);
          const imperialValue = this.convertKgToPounds(weightPerWeekValue);

          this.weightPerWeek.patchValue(imperialValue.toString());
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

  private setFormData(): void {
    this.measurementSystem?.setValue(this.currentGoal.measurementSystem);

    this.userGoals.get('weight')?.setValue(this.currentGoal.weight.toString());
    this.userGoals.get('goal')?.setValue(this.currentGoal.goal);
    this.userGoals
      .get('weightPerWeek')
      ?.setValue(this.currentGoal.weightPerWeek.toString());
    this.userGoals
      .get('activityLevel')
      ?.setValue(this.currentGoal.activityLevel);

    if (this.measurementSystem?.value === UnitMeasurment.METRIC) {
      this.userGoals
        .get('height')
        ?.setValue(this.currentGoal.height.toString());

      this.heightFeet?.clearValidators();
      this.heightInches?.clearValidators();
    } else {
      this.userGoals
        .get('heightFeet')
        ?.setValue(this.currentGoal.height.toString());
      this.userGoals
        .get('heightInches')
        ?.setValue(this.currentGoal.height.toString());

      this.height?.clearValidators();
    }

    this.heightFeet?.updateValueAndValidity();
    this.heightInches?.updateValueAndValidity();
    this.height?.updateValueAndValidity();
  }

  getMaxDate(): Date {
    const maxDate = new Date();
    return maxDate;
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
            label: this.convertKgToPounds(Number(option.label)).toString(),
            value: this.convertKgToPounds(Number(option.value)).toString(),
          }))
        : [...this.weightOptionsKg];
  }

  submit() {
    const formValue = this.userGoals.value;

    const payload = {
      date: formValue.date!,
      measurementSystem: formValue.measurementSystem!,
      weight: parseFloat(formValue.weight!),
      height: parseFloat(formValue.height!),
      goal: formValue.goal!,
      weightPerWeek: parseFloat(formValue.weightPerWeek!),
      activityLevel: formValue.activityLevel!,
      ...(formValue.heightFeet && {
        heightFeet: parseInt(formValue.heightFeet),
      }),
      ...(formValue.heightInches && {
        heightInches: parseInt(formValue.heightInches),
      }),
    };

    this.onSubmit.emit(payload);
  }
}
