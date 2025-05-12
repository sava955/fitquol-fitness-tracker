import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { DashboardService } from '../../services/dashboard.service';
import { PeriodParams } from '../../models/dashboard.interface';

@Component({
  selector: 'app-period-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './period-form.component.html',
  styleUrl: './period-form.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class PeriodFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dashboardService = inject(DashboardService);

  @Output() onPeriodSelected = new EventEmitter<PeriodParams>();

  startDate = this.dashboardService.startDate;

  period = this.fb.group({
    startDate: null,
    endDate: null,
  });

  getMinDate(): Date {
    return this.startDate();
  }

  getMaxDate(): Date {
    const today = new Date();
    return today;
  }

  submit(): void {
    const periodParams = {
      startDate: this.period.value.startDate!,
      endDate: this.period.value.endDate!
    }
    this.onPeriodSelected.emit(periodParams);
  }

  reset(): void {
    this.period.reset();

    this.onPeriodSelected.emit();
  }
}
