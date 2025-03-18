import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card-item',
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss'
})
export class CardItemComponent {
  @Input() data: any;
  @Input() detailsUrl!: string;

  @Output() onOpen = new EventEmitter<string>();

  open(id: string): void {
    this.onOpen.emit(id);
  }
}
