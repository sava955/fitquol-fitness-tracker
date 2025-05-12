import { Injectable, signal, Type } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidePanelService<T> {
  drawerStack = signal<{ component: Type<T>; data?: T }[]>([]);
  closeParams = new ReplaySubject<T>();

  openSidePanel(component: Type<T>, data?: T): void {
    this.drawerStack.update((stack) => [...stack, { component, data }]);
  }
  
  closeTopComponent(params?: T): void {
    if (params) {
      this.closeParams.next(params);
    }
    this.drawerStack.update((stack) => stack.slice(0, -1));
  }

  onCloseSidePanel(): Observable<T> {
    return this.closeParams.asObservable();
  }

  closeAll(): void {
    this.drawerStack.set([]);
  }
}
