import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalSpinnerService {
  display = signal<boolean>(false);

  show(): void {
    this.display.set(true);
  }

  hide(): void {
    this.display.set(false);
  }
}
