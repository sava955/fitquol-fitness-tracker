import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  effect,
  inject,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  MatDrawer,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { SidePanelService } from '../../../core/services/side-panel/side-panel.service';
import { MatButtonModule } from '@angular/material/button';
import { DrawerScrollComponent } from '../drawer-scroll/drawer-scroll.component';

@Component({
  selector: 'app-side-panel',
  imports: [CommonModule, MatSidenavModule, MatButtonModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.scss',
})
export class SidePanelComponent<T extends object> extends DrawerScrollComponent {
  private readonly sidePanelService = inject(SidePanelService);

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('componentContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  activeComponent!: { component: Type<T>; data?: Partial<T> } | null;

  private activeComponentRef: ComponentRef<T> | null = null;

  drawerStack = this.sidePanelService.drawerStack();

  constructor() {
    super();
    effect(() => {
      const stack = this.sidePanelService.drawerStack();
      const latestEntry = stack[stack.length - 1];

      if (stack.length > this.drawerStack.length) {
        this.addNewComponent(latestEntry);
      } else {
        if (!this.drawer) return;

        if (this.activeComponentRef) {
          this.activeComponentRef.destroy();
          this.activeComponentRef = null;
        }

        this.drawer.close();
        this.activeComponent = null;
      }
    });
  }

  private addNewComponent(
    entry: { component: Type<T>; data?: Partial<T> } | undefined
  ): void {
    if (!this.container || !entry) return;

    if (!this.activeComponentRef) {
      this.activeComponent = entry;
      this.container.clear();
      this.drawer.open();

      const componentRef = this.container.createComponent(entry.component);
      this.activeComponentRef = componentRef;

      if (entry.data) {
        Object.assign(componentRef.instance, entry.data);
      }
    }
  }

  onClose(): void {
    this.activeComponent = null;

    if (this.activeComponentRef) {
      this.activeComponentRef.destroy();
      this.activeComponentRef = null;
    }

    this.container.clear();
    this.sidePanelService.closeAll();
  }
}
