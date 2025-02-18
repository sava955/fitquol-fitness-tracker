import { inject, Injectable } from '@angular/core';
import { GlobalSpinnerComponent } from '../../components/global-spinner/global-spinner.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private readonly dialog = inject(MatDialog);

  show(message: string): void {
    this.dialog.open(GlobalSpinnerComponent, {
          width: '300px',
          data: {
            message: message
          }
        });
  }

  hide(): void {
    this.dialog.closeAll();
  }
}
