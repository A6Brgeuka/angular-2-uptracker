import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { ReceivedPackingSlipsListComponent } from './received-packing-slips-list.component';

@NgModule({
  declarations: [
    ReceivedPackingSlipsListComponent,
  ],
  exports: [ReceivedPackingSlipsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class ReceivedPackingSlipsListModule {

}
