import { inject, Injectable } from '@angular/core';
import { GlobalSpinnerComponent } from '../../../shared/components/global-spinner/global-spinner.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class PopupSpinnerService {
  private readonly dialog = inject(MatDialog);

  show(message: string): void {
    this.dialog.open(GlobalSpinnerComponent, {
      width: '300px',
      data: {
        message: message,
      },
    });
  }

  hide(): void {
    this.dialog.closeAll();
  }
}
