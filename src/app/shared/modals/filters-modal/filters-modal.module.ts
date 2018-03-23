import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FiltersModalComponent } from './filters-modal.component';
import { OrdersPageFiltersModule } from './orders-page-filters/orders-page-filters.module';
import { MarketplaceFiltersModule } from './marketplace-filters/marketplace-filters.module';
import { InventoryGroupFiltersModule } from './inventory-group-filters/inventory-group-filters.module';
import { ShoppingListFiltersModule } from './shopping-list-filters/shopping-list-filters.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarketplaceFiltersModule,
    OrdersPageFiltersModule,
    InventoryGroupFiltersModule,
    ShoppingListFiltersModule,
  ],
  declarations: [
    FiltersModalComponent,
  ],
  entryComponents: [
    FiltersModalComponent,
  ],
  exports: [
    FiltersModalComponent,
  ]
})
export class FiltersModalModule {

}
