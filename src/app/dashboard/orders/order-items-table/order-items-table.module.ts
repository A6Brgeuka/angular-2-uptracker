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
import { AllOrdersListModule } from './all-orders-list/all-orders-list.module';
import { BackorderedListModule } from './backordered-list/backordered-list.module';
import { ReconciledListModule } from './reconciled-list/reconciled-list.module';
import { OpenOrdersListModule } from './open-list/open-orders-list.module';
import { FavoritedListModule } from './favorited-list/favorited-list.module';
import { FlaggedListModule } from './flagged-list/flagged-list.module';
import { ReceivedListModule } from './received-list/received-list.module';
import { ClosedListModule } from './closed-list/closed-list.module';
import { ORDER_PROVIDERS } from './services/index';

@NgModule({
  declarations: [
    OrderItemsTableComponent,
  ],
  imports: [
    AppSharedModule,
    AllOrdersListModule,
    BackorderedListModule,
    ReceiveModule,
    ReconciledListModule,
    OrderModule,
    OpenOrdersListModule,
    FavoritedListModule,
    FlaggedListModule,
    SelectVendorModule,
    SearchFilterHeaderModule,
    ReceivedListModule,
    ClosedListModule,
    ReconcileModule,
    ResendOrderModalModule,
    OrderFlagModalModule,
    OrdersPageFiltersModule,
  ],
  providers: [
    ORDER_PROVIDERS
  ]
})
export class OrderItemsTableModule {
}
