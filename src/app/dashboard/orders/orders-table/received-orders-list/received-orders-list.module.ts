import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { ReceivedOrdersListComponent } from './received-orders-list.component';

@NgModule({
  declarations: [
    ReceivedOrdersListComponent,
  ],
  exports: [ReceivedOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
})
export class ReceivedOrdersListModule {

}
