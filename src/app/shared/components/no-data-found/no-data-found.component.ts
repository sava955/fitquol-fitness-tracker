import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NoDataFoundService } from '../../../core/services/no-data-found/no-data-found.service';

@Component({
  selector: 'app-no-data-found',
  imports: [MatIcon],
  templateUrl: './no-data-found.component.html',
  styleUrl: './no-data-found.component.scss'
})
export class NoDataFoundComponent {
private readonly noDataFoundService = inject(NoDataFoundService);

  isShown = this.noDataFoundService.display;
}
