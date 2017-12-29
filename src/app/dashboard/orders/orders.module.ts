import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { AppSharedModule } from '../../shared/shared.module';
import { OrdersShortDetailComponent } from './orders-short-detail/orders-short-detail.component';
import { ReceiveModule } from './receive/receive.module';
import { OrderModule } from './order/order.module';
import { SelectVendorModule } from './select-vendor-modal/select-vendor.module';
import { ReceivedListModule } from './received-list/received-list.module';
import { ResendOrderModalModule } from './resend-order-modal/resend-order-modal.module';
import { ConfirmVoidOrderModalModule } from './order-modals/confirm-void-order-modal/confirm-void-order-modal.module';
import { ReconciledListModule } from './reconciled-list/reconciled-list.module';
import { BackorderedListModule } from './backordered-list/backordered-list.module';
import { ReconcileModule } from './reconcile/reconcile.module';
import { AllOrdersListModule } from './all-orders-list/all-orders-list.module';

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersShortDetailComponent,
  ],
  imports: [
    AppSharedModule,
    AllOrdersListModule,
    BackorderedListModule,
    ReceiveModule,
    OrderModule,
    SelectVendorModule,
    ReceivedListModule,
    ReconciledListModule,
    ReconcileModule,
    ResendOrderModalModule,
    ConfirmVoidOrderModalModule,
  ],
  providers: []
})
export class OrdersModule {
}