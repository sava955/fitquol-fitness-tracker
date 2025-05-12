import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-image-box',
  imports: [CommonModule],
  templateUrl: './image-box.component.html',
  styleUrl: './image-box.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ImageBoxComponent {
  @Input() src!: string;
  @Input() alt!: string;
  @Input() height!: number;
}
