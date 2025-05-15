import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  ViewChild,
} from '@angular/core';
import { DrawerContentScrollService } from '../../../core/services/drawer-content-scroll/drawer-content-scroll.service';
import { MatDrawerContent } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({ template: '' })
export abstract class DrawerScrollComponent implements AfterViewInit {
  @ViewChild(MatDrawerContent) drawerContent!: MatDrawerContent;
  private readonly drawerContentScrollService = inject(
    DrawerContentScrollService
  );
  private readonly destroyRef = inject(DestroyRef);

  ngAfterViewInit(): void {
    this.drawerContent
      .elementScrolled()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map(() => this.drawerContent.measureScrollOffset('bottom'))
      )
      .subscribe((value) => {
        this.drawerContentScrollService.scrollOffset.set(value);
      });
  }
}
