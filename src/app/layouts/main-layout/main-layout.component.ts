import {
  AfterViewInit,
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDrawerContent,
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { SidebarComponent } from '../../core/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../core/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { DrawerContentScrollService } from '../../core/services/drawer-content-scroll/drawer-content-scroll.service';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MatSidenavModule,
    MatButtonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  private readonly drawerContentScrollService = inject(
    DrawerContentScrollService
  );

  @ViewChild(MatDrawerContent) drawerContent!: MatDrawerContent;
  private innerWidth!: number;
  sideNavMode: MatDrawerMode = 'side';

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.setSidenavMode();
  }

  ngOnInit(): void {
    this.setSidenavMode();
  }

  ngAfterViewInit(): void {
    this.drawerContent
      .elementScrolled()
      .pipe(map(() => this.drawerContent.measureScrollOffset('bottom')))
      .subscribe((res) => {
        this.drawerContentScrollService.scrollOffset.set(res);
      });
  }

  private setSidenavMode(): void {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 767) {
      this.sideNavMode = 'over';
    } else {
      this.sideNavMode = 'side';
    }
  }
}
