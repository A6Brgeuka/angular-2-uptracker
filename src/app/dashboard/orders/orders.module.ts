import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { AppSharedModule } from '../../shared/shared.module';
import { OrdersShortDetailComponent } from './orders-short-detail/orders-short-detail.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrdersShortDetailComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class OrdersModule {
}