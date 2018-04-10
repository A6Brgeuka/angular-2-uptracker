import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { AllOrdersListModule } from './all-orders-list/all-orders-list.module';
import { BackorderedOrdersListModule } from './backordered-orders-list/backordered-orders-list.module';
import { ClosedOrdersListModule } from './closed-orders-list/closed-orders-list.module';
import { FavoritedOrdersListModule } from './favorited-orders-list/favorited-orders-list.module';
import { OrdersTableComponent } from './orders-table.component';
import { ORDERS_PROVIDERS } from './services/index';
import { OpenOrdersListModule } from './open-orders-list/open-orders-list.module';
import { ReceivedOrdersListModule } from './received-orders-list/received-orders-list.module';
import { ReconciledOrdersListModule } from './reconciled-orders-list/reconciled-orders-list.module';
import { FlaggedOrdersListModule } from './flagged-orders-list/flagged-orders-list.module';

@NgModule({
  declarations: [
    OrdersTableComponent,
  ],
  imports: [
    AppSharedModule,
    AllOrdersListModule,
    BackorderedOrdersListModule,
    ClosedOrdersListModule,
    FavoritedOrdersListModule,
    FlaggedOrdersListModule,
    OpenOrdersListModule,
    ReceivedOrdersListModule,
    ReconciledOrdersListModule,
  ],
  providers: [
    ORDERS_PROVIDERS
  ]
})
export class OrdersTableModule {
}
