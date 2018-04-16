import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { AppSharedModule } from '../../shared/shared.module';
import { ReceiveModule } from './receive/receive.module';
import { OrderModule } from './order/order.module';
import { ReconcileModule } from './reconcile/reconcile.module';
import { SearchFilterHeaderModule } from '../../shared/components/search-filter-header/search-filter-header.module';
import { OrdersPageFiltersModule } from '../../shared/modals/filters-modal/orders-page-filters/orders-page-filters.module';
import { OrdersTableModule } from './orders-table/orders-table.module';
import { OrderItemsTableModule } from './order-items-table/order-items-table.module';
import { PackingSlipsTableModule } from './packing-slips-table/packing-slips-table.module';
import { InvoicesTableModule } from './invoices-table/invoices-table.module';
import { OrdersService } from './orders.service';

@NgModule({
  declarations: [
    OrdersComponent,
  ],
  imports: [
    AppSharedModule,
    ReceiveModule,
    OrderModule,
    SearchFilterHeaderModule,
    ReconcileModule,
    OrdersPageFiltersModule,
    OrdersTableModule,
    OrderItemsTableModule,
    PackingSlipsTableModule,
    InvoicesTableModule,
  ],
  providers: [
    OrdersService,
  ]
})
export class OrdersModule {
}
