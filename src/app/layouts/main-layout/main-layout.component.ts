import {
  AfterViewInit,
  Component,
  DestroyRef,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly destroyRef = inject(DestroyRef);

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
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => this.drawerContent.measureScrollOffset('bottom')))
      .subscribe((value) => {
        this.drawerContentScrollService.scrollOffset.set(value);
      });
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
