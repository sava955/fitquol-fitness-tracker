import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/users/user.service';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { User } from '../../models/user/user.interface';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() sideNavMode!: MatDrawerMode;
  @Output() sidebarToggled = new EventEmitter();

  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  user!: User;

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe({
      next: (response: ResponseObj<User>) => {
        this.user = response.data;
      }, 
      error: (err) => {
        console.log(err);
      } 
    })
  }

  toggleSidebar(): void {
    this.sidebarToggled.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
