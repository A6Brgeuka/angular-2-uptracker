import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { OpenOrdersListComponent } from './open-orders-list.component';

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
