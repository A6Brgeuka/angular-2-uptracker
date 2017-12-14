import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { AppSharedModule } from '../../shared/shared.module';
import { OrdersShortDetailComponent } from './orders-short-detail/orders-short-detail.component';
import { ReceiveModule } from './receive/receive.module';
import { OrderModule } from './order/order.module';
import { SelectVendorModule } from './select-vendor-modal/select-vendor.module';
import { ReceivedListModule } from './received-list/received-list.module';

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersShortDetailComponent,
  ],
  imports: [
    AppSharedModule,
    ReceiveModule,
    OrderModule,
    SelectVendorModule,
    ReceivedListModule,
  ],
  providers: []
})
export class OrdersModule {
}