import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrderItemsTableComponent } from './order-items-table.component';
import { ReceiveModule } from '../receive/receive.module';
import { OrderModule } from '../order/order.module';
import { SelectVendorModule } from '../select-vendor-modal/select-vendor.module';
import { SearchFilterHeaderModule } from '../../../shared/components/search-filter-header/search-filter-header.module';
import { ReconcileModule } from '../reconcile/reconcile.module';
import { ResendOrderModalModule } from '../resend-order-modal/resend-order-modal.module';
import { OrderFlagModalModule } from '../directives/order-flag-modal/order-flag-modal.module';
import { OrdersPageFiltersModule } from '../../../shared/modals/filters-modal/orders-page-filters/orders-page-filters.module';

import { ORDER_ITEMS_PROVIDERS } from './services/index';
import { AllItemsListModule } from './all-order-items-list/all-order-items-list.module';
import { BackorderedItemsListModule } from './backordered-items-list/backordered-items-list.module';
import { ReconciledItemsListModule } from './reconciled-items-list/reconciled-items-list.module';
import { OpenItemsListModule } from './open-items-list/open-items-list.module';
import { FavoritedItemsListModule } from './favorited-items-list/favorited-items-list.module';
import { FlaggedItemsListModule } from './flagged-items-list/flagged-items-list.module';
import { ReceivedItemsListModule } from './received-items-list/received-items-list.module';
import { ClosedItemsListModule } from './closed-items-list/closed-items-list.module';

@NgModule({
  declarations: [
    OrderItemsTableComponent,
  ],
  imports: [
    AppSharedModule,
    AllItemsListModule,
    BackorderedItemsListModule,
    ReceiveModule,
    ReconciledItemsListModule,
    OrderModule,
    OpenItemsListModule,
    FavoritedItemsListModule,
    FlaggedItemsListModule,
    SelectVendorModule,
    SearchFilterHeaderModule,
    ReceivedItemsListModule,
    ClosedItemsListModule,
    ReconcileModule,
    ResendOrderModalModule,
    OrderFlagModalModule,
    OrdersPageFiltersModule,
  ],
  providers: [
    ORDER_ITEMS_PROVIDERS
  ]
})
export class OrderItemsTableModule {
}
