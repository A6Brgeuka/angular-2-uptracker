import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { AllOrdersListComponent } from './all-orders-list.component';

@NgModule({
  declarations: [
    AllOrdersListComponent,
  ],
  exports: [AllOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class AllOrdersListModule {

}
