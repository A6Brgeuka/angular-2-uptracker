import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { FlaggedOrdersListComponent } from './flagged-orders-list.component';

@NgModule({
  declarations: [
    FlaggedOrdersListComponent,
  ],
  exports: [FlaggedOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class FlaggedOrdersListModule {

}
