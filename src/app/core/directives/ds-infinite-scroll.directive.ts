import { Directive, effect, EventEmitter, inject, Output } from '@angular/core';
import { DrawerContentScrollService } from '../services/drawer-content-scroll/drawer-content-scroll.service';

@Directive({
  selector: '[appDsInfiniteScroll]'
})
export class DsInfiniteScrollDirective {
  @Output() scrolled = new EventEmitter<boolean>(false);

  private readonly drawerContentScroll = inject(DrawerContentScrollService);

  constructor() {
    effect(() => {
      if (this.drawerContentScroll.scrollOffset() < 150) {
        this.scrolled.emit(true);
      } else {
        this.scrolled.emit(false);
      }
    });
  }
}
