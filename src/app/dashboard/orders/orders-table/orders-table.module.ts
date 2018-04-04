import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrdersTableComponent } from './orders-table.component';
import { ORDERS_PROVIDERS } from './services/index';
import { AllOrdersListModule } from './all-orders-list/all-orders-list.module';
import { OpenOrdersListModule } from './open-orders-list/open-orders-list.module';
import { ReceivedOrdersListModule } from './received-orders-list/received-orders-list.module';

@NgModule({
  declarations: [
    OrdersTableComponent,
  ],
  imports: [
    AppSharedModule,
    AllOrdersListModule,
    OpenOrdersListModule,
    ReceivedOrdersListModule,
  ],
  providers: [
    ORDERS_PROVIDERS
  ]
})
export class OrdersTableModule {
}
