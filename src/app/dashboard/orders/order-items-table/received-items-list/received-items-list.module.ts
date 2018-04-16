import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { ReceivedItemsListComponent } from './received-items-list.component';

@NgModule({
  declarations: [
    ReceivedItemsListComponent,
  ],
  exports: [ReceivedItemsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
})
export class ReceivedItemsListModule {

}
