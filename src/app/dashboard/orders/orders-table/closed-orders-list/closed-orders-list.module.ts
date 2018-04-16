import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { ClosedOrdersListComponent } from './closed-orders-list.component';

@NgModule({
  declarations: [
    ClosedOrdersListComponent,
  ],
  exports: [ClosedOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class ClosedOrdersListModule {

}
