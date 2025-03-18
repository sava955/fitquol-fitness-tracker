import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, MatListModule, MatButtonModule, RouterLinkActive, MatIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() sideNavMode!: MatDrawerMode;
  @Output() sideNavClosed = new EventEmitter();

  navItems = [
    {
      path: 'dashboard',
      label: 'Dashboard',
      icon: 'dashboard'
    },
    {
      path: 'diary',
      label: 'Diary',
      icon: 'local_library'
    },
    {
      path: 'exercises',
      label: 'Exercises',
      icon: 'fitness_center'
    },
    /*{
      path: 'nutrition',
      label: 'Nutrition',
      icon: 'restaurant'
    }*/
  ];

  closeSidenav(): void {
    this.sideNavClosed.emit();
  }
}
