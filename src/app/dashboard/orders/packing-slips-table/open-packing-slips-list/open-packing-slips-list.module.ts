import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OpenPackingSlipsListComponent } from './open-packing-slips-list.component';

@NgModule({
  declarations: [
    OpenPackingSlipsListComponent,
  ],
  exports: [OpenPackingSlipsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class OpenPackingSlipsListModule {

}
