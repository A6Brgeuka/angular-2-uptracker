import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { AllItemsListComponent } from './all-order-items-list.component';

@NgModule({
  declarations: [
    AllItemsListComponent,
  ],
  exports: [AllItemsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class AllItemsListModule {

}
