import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth/auth.service';
import { User } from '../../features/user/models/user.interface';
import { MatMenuModule } from '@angular/material/menu';
import { UserDataComponent } from '../../shared/components/user-data/user-data.component';
import { RouterLink } from '@angular/router';
import { Goal } from '../../core/models/goal';
import { UserService } from '../../features/user/services/user.service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    UserDataComponent,
    RouterLink,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() sideNavMode!: MatDrawerMode;
  @Output() sidebarToggled = new EventEmitter();

  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);

  user!: User;
  goal!: Goal;

  ngOnInit(): void {
    this.userService.getOne({}, 'current-user').subscribe((response) => {
      this.user = response.data as User;
      this.goal = this.user.goals[0];

      this.userService.setAuthenticatedUser(this.user);
    });
  }

  toggleSidebar(): void {
    this.sidebarToggled.emit();
  }

  logout(): void {
    this.authService.logout();
  }
}
