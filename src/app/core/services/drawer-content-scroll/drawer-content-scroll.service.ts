import { Injectable, signal } from '@angular/core';
import { debounceTime, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerContentScrollService {
  scrollOffset = signal<number | null>(null);
  loadData = signal<boolean>(true);

  private readonly loadMore = new ReplaySubject<boolean>();

  setLoadMore(isLoadMore: boolean): void {
    this.loadMore.next(isLoadMore);
  }

  onLoadMore(): Observable<boolean> {
    return this.loadMore.asObservable().pipe(
      debounceTime(200)
    );
  }
}
