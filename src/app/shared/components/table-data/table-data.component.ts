import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Column } from '../../../core/models/table';
import { NoDataFoundComponent } from '../no-data-found/no-data-found.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-table-data',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    NoDataFoundComponent,
    MatTooltipModule
  ],
  templateUrl: './table-data.component.html',
  styleUrl: './table-data.component.scss',
})
export class TableDataComponent<T> implements OnInit {
  @Input() data!: T[];
  @Input() searchData = true;
  @Input() displayedColumns!: Column<T>[];
  @Input() actionBtns!: void;

  displayedColumnKeys!: string[];

  ngOnInit(): void {
    this.displayedColumnKeys = this.displayedColumns?.map((col) => col.id);
  }
}
