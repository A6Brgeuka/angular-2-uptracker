import { NgModule } from '@angular/core';

import { OpenOrdersListComponent } from './open-orders-list.component';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    OpenOrdersListComponent,
  ],
  exports: [OpenOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
})
export class OpenOrdersListModule {

}
