import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-date-controller-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatIcon,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './date-controller-card.component.html',
  styleUrl: './date-controller-card.component.scss',
})
export class DateControllerCardComponent implements OnInit {
  @Input() day: Date = new Date();
  @Input() startDate: Date = new Date();
  @Output() onSetDayParams = new EventEmitter<Date>();

  dayCtrl = new FormControl();

  ngOnInit(): void {
    this.dayCtrl.valueChanges.subscribe((value) => {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        this.day = parsed;
        this.setDayParams();
      }
    });
  }

  isNextDisabled(): boolean {
    const currentDay = new Date(this.day);
    currentDay.setHours(0, 0, 0, 0);
    return currentDay.getTime() === this.getMaxDate().getTime();
  }

  getMaxDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  getNextDay(): void {
    this.day = this.addDays(this.day, 1);
    this.setDay();
  }

  getPreviousDay(): void {
    this.day = this.addDays(this.day, -1);
    this.setDay();
  }

  private setDay(): void {
    this.dayCtrl.setValue(this.day, { emitEvent: false });
    this.setDayParams();
  }

  private setDayParams(): void {
    this.onSetDayParams.emit(this.day);
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}