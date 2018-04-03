import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrdersTableComponent } from './orders-table.component';

@NgModule({
  declarations: [
    OrdersTableComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: [
    // ORDER_PROVIDERS
  ]
})
export class OrdersTableModule {
}
