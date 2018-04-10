import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { BackorderedOrdersListComponent } from './backordered-orders-list.component';

@NgModule({
  declarations: [
    BackorderedOrdersListComponent,
  ],
  exports: [BackorderedOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class BackorderedOrdersListModule {

}
