import { Component, inject, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-global-spinner',
  imports: [MatDialogContent, MatProgressSpinnerModule],
  templateUrl: './global-spinner.component.html',
  styleUrl: './global-spinner.component.scss',
})
export class GlobalSpinnerComponent {
  readonly dialogRef = inject(MatDialogRef<GlobalSpinnerComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
