import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-page-title',
  imports: [MatIcon, MatButtonModule],
  templateUrl: './page-title.component.html',
  styleUrl: './page-title.component.scss',
})
export class PageTitleComponent {
  @Input() pageTitle!: string;
  @Input() goBackButton = true;
  
  @Output() onGoBack = new EventEmitter();

  goBack(): void {
    this.onGoBack.emit();
  }
}
