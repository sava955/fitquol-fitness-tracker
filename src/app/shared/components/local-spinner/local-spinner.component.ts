import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LocalSpinnerService } from '../../../core/services/local-spinner/local-spinner.service';

@Component({
  selector: 'app-local-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './local-spinner.component.html',
  styleUrl: './local-spinner.component.scss'
})
export class LocalSpinnerComponent {
  private readonly localSpinnerService = inject(LocalSpinnerService);

  isShown = this.localSpinnerService.display;
}
