import { NgModule } from '@angular/core';

import { ReceivedListComponent } from './received-list.component';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    ReceivedListComponent,
  ],
  exports: [ReceivedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
})
export class ReceivedListModule {

}
