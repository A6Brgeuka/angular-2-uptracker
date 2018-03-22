import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FiltersModalComponent } from './filters-modal.component';
import { OrdersPageFiltersModule } from './orders-page-filters/orders-page-filters.module';
import { MarketplaceFiltersModule } from './marketplace-filters/marketplace-filters.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MarketplaceFiltersModule,
    OrdersPageFiltersModule,
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
