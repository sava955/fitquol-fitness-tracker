import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { Exercise, ExerciseGroup } from '../../../../core/models/exercises/exercise.interface';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, Location } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import {
  MatCalendar,
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {
  ExercisePlanner,
  ExerciseStatus,
  ScheduleRange,
} from '../../../../core/enums/exercises/exercise-planer.enum';
import { FormBaseComponent } from '../../../../shared/components/form-base/form-base.component';

@Component({
  selector: 'app-add-exercise-form',
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    CommonModule,
    FormBaseComponent
  ],
  templateUrl: './add-exercise-form.component.html',
  styleUrl: './add-exercise-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter()],
})
export class AddExerciseFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<AddExerciseFormComponent>);
  private readonly location = inject(Location);
  private readonly fb = inject(FormBuilder);

  exerciseForm!: FormGroup;

  days = [
    'Sonday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  private duration = 0;
  caloriesBurned = 0;

  plannerTypeValue:
    | ExercisePlanner.DAILY_PLANNER
    | ExercisePlanner.WEEKLY_PLANNER = ExercisePlanner.DAILY_PLANNER;
  currentMonthScheduleRangeValue:
    | ScheduleRange.FROM_TODAY
    | ScheduleRange.WHOLE_MONTH = ScheduleRange.FROM_TODAY;

  minDate!: Date;
  maxDate!: Date;

  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  get plannerType() {
    return this.exerciseForm.get('plannerType');
  }

  get daysFormArray() {
    return this.exerciseForm.controls['days'] as FormArray;
  }

  get sets() {
    return this.exerciseForm.get('sets');
  }

  get setDuration() {
    return this.exerciseForm.get('setDuration');
  }

  get currentMonthScheduleRange() {
    return this.exerciseForm.get('currentMonthScheduleRange');
  }

  get nextMonthIncluded() {
    return this.exerciseForm.get('nextMonthIncluded');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public exercise: Exercise,
    private readonly dateAdapter: DateAdapter<Date>
  ) {
    this.dialogRef.afterClosed().subscribe(() => this.location.back());
  }

  ngOnInit(): void {
    this.minDate = this.getPreviousMonthFirstDay();
    this.maxDate = this.getNextMonthLastDay();

    this.initExerciseForm();
    this.initFormEvent();
  }

  private initExerciseForm(): void {
    this.exerciseForm = this.fb.group({
      plannerType: this.plannerTypeValue,
      days: this.fb.array([], Validators.required),
      currentMonthScheduleRange: this.currentMonthScheduleRangeValue,
      nextMonthIncluded: null,
      sets: [null, Validators.required],
      setDuration: [null, Validators.required],
    });
  }

  private initFormEvent(): void {
    this.plannerType?.valueChanges.subscribe((_) => {
      this.daysFormArray.clear();
    });

    this.sets?.valueChanges.subscribe((res) => {
      if (this.setDuration?.value !== '') {
        this.duration = this.setDuration?.value * res;

        this.calculateCalories();
      }
    });

    this.setDuration?.valueChanges.subscribe((res) => {
      if (this.setDuration?.value !== '') {
        this.duration = res;
      } else {
        this.duration = this.setDuration.value * res;
      }

      this.calculateCalories();
    });

    this.currentMonthScheduleRange?.valueChanges.subscribe((res) => {
      if (res === ScheduleRange.WHOLE_MONTH) {
        this.handleScheduleRange();
      } else {
        const previousDates = this.daysFormArray.value
          .map((date: Date, index: number) => (date < new Date() ? index : -1))
          .filter((index: number) => index !== -1)
          .sort((a: any, b: any) => {
            return b - a;
          });

        previousDates.forEach((i: number) => {
          this.daysFormArray.removeAt(i);
        });
      }
    });

    this.nextMonthIncluded?.valueChanges.subscribe((res) => {
      if (res) {
        this.handleScheduleRange();
      } else {
        const nextMonthIndexes = this.daysFormArray.value
          .map((date: Date, index: number) =>
            date.getMonth() !== new Date().getMonth() ? index : -1
          )
          .filter((index: number) => index !== -1)
          .sort((a: any, b: any) => {
            return b - a;
          });

        nextMonthIndexes.forEach((i: number) => {
          this.daysFormArray.removeAt(i);
        });
      }
    });
  }

  private handleScheduleRange(): void {
    const days: number[] = Array.from(
      new Set(
        this.daysFormArray.value.map((item: Date) =>
          this.days.findIndex((_, i: number) => item.getDay() === i)
        )
      )
    );

    days.forEach((d: number) => {
      this.addDay(true, d);
    });
  }

  private getPreviousMonthFirstDay(): Date {
    const now = new Date();
    const previousMonth = now.getMonth() - 1;
    return new Date(now.getFullYear(), previousMonth, 1);
  }

  private getNextMonthLastDay(): Date {
    const now = new Date();
    const nextMonth = now.getMonth() + 1;
    return new Date(now.getFullYear(), nextMonth + 1, 0);
  }

  toggleDate(date: Date | null): void {
    const dateIndex = this.daysFormArray.value.findIndex((selectedDate: Date) =>
      this.dateAdapter.sameDate(selectedDate, date)
    );

    if (dateIndex === -1 && date) {
      this.daysFormArray.push(new FormControl(date));
    } else {
      const findDate = this.daysFormArray.value.findIndex(
        (d: Date) => d === date
      );
      this.daysFormArray.removeAt(findDate);
    }

    this.calendar.updateTodaysDate();
  }

  highlightSelectedDays: MatCalendarCellClassFunction<Date> = (
    date: Date,
    view: string
  ) => {
    if (view === 'month') {
      const isSelectedDay = this.daysFormArray.value.some(
        (selectedDay: Date) =>
          selectedDay.getDate() === date.getDate() &&
          selectedDay.getMonth() === date.getMonth() &&
          selectedDay.getFullYear() === date.getFullYear()
      );
      return isSelectedDay ? 'highlight-selected-days' : '';
    }
    return '';
  };

  isNoDaysLeft(dayCheckbox: MatCheckbox): boolean {
    if (
      this.currentMonthScheduleRange?.value === ScheduleRange.WHOLE_MONTH ||
      this.nextMonthIncluded?.value === true
    ) {
      return false;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const currentDay = today.getDate();

    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    for (let day = currentDay; day <= lastDayOfMonth; day++) {
      const date = new Date(year, month, day);
      if (date.getDay() === Number(dayCheckbox.value)) {
        return false;
      }
    }

    dayCheckbox.checked = false;
    return true;
  }

  addDay(checked: boolean, index: number): void {
    const day = this.days[index];
    if (checked) {
      this.createDaysFormArray(day);
    } else {
      this.removeDays(day);
    }
  }

  private createDaysFormArray(day: string): void {
    const selectedDays = this.setSelectedDays(
      new Date(),
      this.days.indexOf(day)
    );

    selectedDays.forEach((selectedDay) => {
      const exists = this.daysFormArray.value.some(
        (existingDay: Date) => existingDay.getTime() === selectedDay.getTime()
      );

      if (!exists) {
        this.daysFormArray.push(new FormControl(selectedDay));
      }
    });
  }

  private removeDays(day: string): void {
    const daysToRemove = this.daysFormArray.value
      .map((d: Date, index: number) =>
        d.getDay() === this.days.indexOf(day) ? index : -1
      )
      .sort((a: any, b: any) => {
        return b - a;
      })
      .filter((index: number) => index !== -1);

    daysToRemove.forEach((d: number) => {
      this.daysFormArray.removeAt(d);
    });
  }

  private setSelectedDays(date: Date, dayIndex: number): Date[] {
    const selectedDays: Date[] = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const currentDay = date.getDate();

    let months: number[] = [];

    months.push(month);

    if (this.nextMonthIncluded?.value) {
      months.push(month + 1);
    }

    months.forEach((m, index) => {
      const day = new Date(year, m, 1);

      while (day.getDay() !== dayIndex) {
        day.setDate(day.getDate() + 1);
      }

      while (day.getMonth() === m) {
        if (
          index === 1 ||
          this.currentMonthScheduleRange?.value === ScheduleRange.WHOLE_MONTH ||
          day.getDate() >= currentDay
        ) {
          selectedDays.push(new Date(day));
        }

        day.setDate(day.getDate() + 7);
      }
    });

    return selectedDays;
  }

  private calculateCalories(): void {
    this.caloriesBurned = Math.floor(
      this.exercise.mets * /*this.weight*/ 86 * (this.duration / 60)
    );
  }

  addExercise(value: ExerciseGroup): void {
    if (this.exerciseForm.invalid) {
      return;
    }

    let exerciseGroup: ExerciseGroup[] = [];

    this.daysFormArray.value.forEach((day: Date) => {
      const singleExercise: ExerciseGroup = {
        day: day,
        exercise: this.exercise,
        sets: value.sets,
        setDuration: value.setDuration,
        status: ExerciseStatus.TO_DO,
        caloriesBurned: this.caloriesBurned,
      };

      exerciseGroup.push(singleExercise);
    });

    this.submitForm(exerciseGroup);
  }

  private submitForm(exerciseGroup: ExerciseGroup[]): void {
    console.log(exerciseGroup);
  }
}
