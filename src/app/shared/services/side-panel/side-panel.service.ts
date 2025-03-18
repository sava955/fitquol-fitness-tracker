import { Injectable, signal } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidePanelService {
  drawerStack = signal<{ component: any; data?: any }[]>([]);
  stackAdded = signal<boolean>(false);
  // closeParams = signal<any>({})
  closeParams = new ReplaySubject();

  openSidePanel(component: any, data?: any): void {
    this.stackAdded.set(true);
    this.drawerStack.update((stack) => [...stack, { component, data }]);
  }

  closeTopComponent(params?: any): void {
    this.closeParams.next(params);
    this.stackAdded.set(false);
    this.drawerStack.update((stack) => stack.slice(0, -1));
  }

  onCloseSidePanel(): Observable<any> {
    return this.closeParams.asObservable();
  }

  closeAll(): void {
    this.stackAdded.set(false);
    this.drawerStack.set([]);
  }
}
