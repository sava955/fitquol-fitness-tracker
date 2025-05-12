import { Directive, effect, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { DrawerContentScrollService } from '../services/drawer-content-scroll/drawer-content-scroll.service';

@Directive({
  selector: '[appDsInfiniteScroll]'
})
export class DsInfiniteScrollDirective implements OnInit {
  @Output() scrolled = new EventEmitter<boolean>(false);

  private readonly drawerContentScroll = inject(DrawerContentScrollService);

  constructor() {
    effect(() => {
      if (this.drawerContentScroll.scrollOffset()) { 
        if (this.drawerContentScroll.scrollOffset()! < 1 && this.drawerContentScroll.loadData()) {
          this.drawerContentScroll.setLoadMore(true);
        } else {
          this.drawerContentScroll.setLoadMore(false);
        }
        
      } else {
        this.drawerContentScroll.setLoadMore(false);
      }
    });
  }

  ngOnInit(): void {
    this.drawerContentScroll.scrollOffset.set(0);
  }
}
