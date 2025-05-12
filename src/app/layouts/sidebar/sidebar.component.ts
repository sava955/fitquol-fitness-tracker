import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawerMode } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, MatListModule, MatButtonModule, RouterLinkActive, MatIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);

  @Input() sideNavMode!: MatDrawerMode;

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
      path: 'recipes',
      label: 'Recipes',
      icon: 'restaurant'
    },
    {
      path: 'user',
      label: 'Profile',
      icon: 'person'
    },
  ];
  
  logout(): void {
    this.authService.logout();
  }
}
