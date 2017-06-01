import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { AppSharedModule } from '../../shared/shared.module';
import { OrdersShortDetailComponent } from './orders-short-detail/orders-short-detail.component';
import { ReceiveModule } from './receive/receive.module';

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersShortDetailComponent
  ],
  imports: [
    AppSharedModule,
    ReceiveModule
  ],
  providers: []
})
export class OrdersModule {
}