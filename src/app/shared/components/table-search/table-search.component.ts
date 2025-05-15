import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidePanelService } from '../../../core/services/side-panel/side-panel.service';
import { DrawerContentScrollService } from '../../../core/services/drawer-content-scroll/drawer-content-scroll.service';
import { LocalSpinnerService } from '../../../core/services/local-spinner/local-spinner.service';
import { FormControl } from '@angular/forms';
import { PaginationData } from '../../../core/models/pagination-data';
import { setParams } from '../../../core/utils/handle-params';
import { debounceTime, distinctUntilChanged, Observable, tap } from 'rxjs';
import { withLocalAppSpinner } from '../../../core/utils/with-local-spinner';
import { isMoreDataToLoad } from '../../../core/utils/load-data-on-scroll';
import { withNoDataFound } from '../../../core/utils/with-no-data-found';
import { NoDataFoundService } from '../../../core/services/no-data-found/no-data-found.service';

@Component({ template: '' })
export abstract class TableSearch<T, P> implements OnInit {
  protected readonly sidePanelService = inject(SidePanelService);
  protected readonly drawerContentScrollService = inject(
    DrawerContentScrollService
  );
  protected readonly spinnerService = inject(LocalSpinnerService);
  protected readonly noDataFoundService = inject(NoDataFoundService);
  protected readonly destroyRef = inject(DestroyRef);

  items: T[] = [];
  searchControl = new FormControl('');
  protected abstract paginationData: PaginationData<P>;
  protected params!: PaginationData<P>;

  protected abstract fetchItems(params: PaginationData<P>): Observable<T[]>;
  protected abstract mapResponse(response: T[]): T[];
  protected abstract buildSearchParams(value: string): PaginationData<P>;

  ngOnInit(): void {
    this.params = setParams(this.paginationData);
    this.loadOnScroll();
    this.onSearch();
  }

  private loadOnScroll(): void {
    this.drawerContentScrollService
      .onLoadMore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((load) => {
        if (load) {
          this.params.start = (this.params.start ?? 0) + 1;
          this.getItems();
        }
      });
  }

  private onSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.items = [];
        this.params = this.buildSearchParams(value ?? '');
        this.getItems();
      });
  }

  private getItems(): void {
    this.fetchItems(this.params)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        withLocalAppSpinner(this.spinnerService),
        withNoDataFound(this.noDataFoundService),
        tap((response: T[]) => {
          isMoreDataToLoad(
            this.drawerContentScrollService,
            response,
            this.params.limit!
          );
        })
      )
      .subscribe((response: T[]) => {
        this.items = [...this.items, ...this.mapResponse(response)];
      });
  }

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
