import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  DestroyRef,
  effect,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  MatDrawer,
  MatDrawerContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { SidePanelService } from '../../services/side-panel/side-panel.service';
import { MatButtonModule } from '@angular/material/button';
import { DrawerContentScrollService } from '../../../core/services/drawer-content-scroll/drawer-content-scroll.service';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule, MatSidenavModule, MatButtonModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
})
export class SidePanelComponent implements AfterViewInit {
  private readonly sidePanelService = inject(SidePanelService);
  private readonly drawerContentScrollService = inject(
    DrawerContentScrollService
  );
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(MatDrawerContent) drawerContent!: MatDrawerContent;
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('componentContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  activeComponent!: { component: any; data?: any } | null;
  
  constructor() {
    effect(() => {
      const stack = this.sidePanelService.drawerStack();
      const isStackAdded = this.sidePanelService.stackAdded();
      const latestEntry = stack[stack.length - 1];

      if (isStackAdded) {
        this.addNewComponent(latestEntry);
      } else {
        if (!this.drawer) return;

        if (stack.length > 0) {
          if (this.activeComponent !== latestEntry) {
            this.drawer.close();
            this.activeComponent = null;
          }

          return;
        }

        this.drawer.close();
        this.activeComponent = null;
      }
    });
  }

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

  private addNewComponent(
    entry: { component: any; data?: any } | undefined
  ): void {
    if (!this.container || !entry) return;

    let componentRef!: ComponentRef<any>;

    if (!this.activeComponent) {
      this.activeComponent = entry;
      this.container.clear();
      this.drawer.open();
      componentRef = this.container.createComponent(entry.component);

      if (entry.data) {
        Object.assign(componentRef.instance, entry.data);
      }
    }
  }

  closeTop(): void {
    this.sidePanelService.closeTopComponent();
  }

  close(): void {
    this.sidePanelService.closeAll();
  }

  onClose(): void {
    this.activeComponent = null;
  }
}
