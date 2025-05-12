import {
  Component,
  HostListener,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { DrawerScrollComponent } from '../../shared/components/drawer-scroll/drawer-scroll.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MatSidenavModule,
    MatButtonModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent extends DrawerScrollComponent implements OnInit {
  private innerWidth!: number;
  sideNavMode: MatDrawerMode = 'side';

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setSidenavMode();
  }

  ngOnInit(): void {
    this.setSidenavMode();
  }

  private setSidenavMode(): void {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 1200) {
      this.sideNavMode = 'over';
      return;
    }

    this.sideNavMode = 'side';
  }
}
