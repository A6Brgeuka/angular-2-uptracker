import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OpenOrdersListComponent } from './open-orders-list.component';
import { OrderTableModule } from '../directives/order-table/order-table.module';
import { OpenOrdersListService } from './open-orders-list.service';

@NgModule({
  declarations: [
    OpenOrdersListComponent,
  ],
  exports: [OpenOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
  providers: [
    OpenOrdersListService,
  ],
})
export class OpenOrdersListModule {

}
