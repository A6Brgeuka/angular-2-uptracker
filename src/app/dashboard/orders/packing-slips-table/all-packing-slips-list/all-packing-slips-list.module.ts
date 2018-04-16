import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { AllPackingSlipsListComponent } from './all-packing-slips-list.component';

@NgModule({
  declarations: [
    AllPackingSlipsListComponent,
  ],
  exports: [AllPackingSlipsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class AllPackingSlipsListModule {

}
