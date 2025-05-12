import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FoodsComponent } from './foods/foods.component';
import { RecipesFoodsComponent } from './recipes-foods/recipes-foods.component';
import { SidePanelComponent } from '../../../../shared/components/side-panel/side-panel.component';
import { DsInfiniteScrollDirective } from '../../../../core/directives/ds-infinite-scroll.directive';
import { PageTitleComponent } from '../../../../shared/components/page-title/page-title.component';
import { SidePanelService } from '../../../../core/services/side-panel/side-panel.service';

@Component({
  selector: 'app-nutrition',
  imports: [
    SidePanelComponent,
    DsInfiniteScrollDirective,
    PageTitleComponent,
    MatTableModule,
    MatTabsModule,
    FoodsComponent,
    RecipesFoodsComponent,
  ],
  templateUrl: './meals.component.html',
  styleUrl: './meals.component.scss',
})
export class MealsComponent {
  private readonly sidePanelService = inject(SidePanelService);

  day!: Date;
  mealType!: string;
  pageTitle!: string;

  goBack(): void {
    this.sidePanelService.closeTopComponent();
  }
}
