import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrderItemsTableComponent } from './order-items-table.component';

@NgModule({
  declarations: [
    OrderItemsTableComponent,
  ],
  imports: [
    AppSharedModule,
    // AllOrdersListModule,
    // BackorderedListModule,
    // ReceiveModule,
    // ReconciledListModule,
    // OrderModule,
    // OpenOrdersListModule,
    // FavoritedListModule,
    // FlaggedListModule,
    // SelectVendorModule,
    // SearchFilterHeaderModule,
    // ReceivedListModule,
    // ClosedListModule,
    // ReconcileModule,
    // ResendOrderModalModule,
    // OrderFlagModalModule,
    // OrdersPageFiltersModule,
  ],
  providers: [
    // ORDER_PROVIDERS
  ]
})
export class OrderItemsTableModule {
}
