import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Column } from '../../../core/models/table/table';

@Component({
  selector: 'app-table-data',
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatIconModule],
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
