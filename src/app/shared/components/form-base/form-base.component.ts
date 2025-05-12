import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PopupSpinnerService } from '../../../core/services/popup-spinner/popup-spinner-service.service';
import { ResponseObj } from '../../../core/models/http-response.interface';
import { withPopupAppSpinner } from '../../../core/utils/with-popup-spinner';
import { ActionButtons } from '../../../core/models/action.buttons.interface';
import { SidePanelService } from '../../../core/services/side-panel/side-panel.service';

@Component({ template: '' })
export abstract class FormBaseComponent<T> implements OnInit {
  protected readonly spinnerService = inject(PopupSpinnerService);
  protected readonly sidePanelService = inject(SidePanelService);
  protected readonly fb = inject(FormBuilder);
  protected readonly destroyRef = inject(DestroyRef);

  mode!: string;
  actionBtns!: ActionButtons[];
  formGroup!: FormGroup;
  errorMessage!: string;

  protected abstract setActionButtons(): ActionButtons[];
  protected abstract buildForm(): void;
  protected abstract onFormEvent(): void;
  protected abstract getSubmitMethod(
    data: T,
    id?: string
  ): Observable<ResponseObj<T>>;
  protected abstract onSubmit(): void;
  protected abstract onSuccess(response: ResponseObj<T>): void;

  ngOnInit(): void {
    this.actionBtns = this.setActionButtons();
    this.buildForm();
    this.onFormEvent();
  }

  protected submit(data: T, id?: string): void {
    this.formGroup.markAllAsTouched();

    if (this.formGroup.invalid) {
      this.errorMessage = 'Form is not valid';
      return;
    }

    this.getSubmitMethod(data, id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withPopupAppSpinner(this.spinnerService, 'Loading...')
      )
      .subscribe({
        next: (response) => {
          this.onSuccess(response);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
        },
      });
  }

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
