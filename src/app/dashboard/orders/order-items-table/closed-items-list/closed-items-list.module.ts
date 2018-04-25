import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { ClosedItemsListComponent } from './closed-items-list.component';

@NgModule({
  declarations: [
    ClosedItemsListComponent,
  ],
  exports: [ClosedItemsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class ClosedItemsListModule {

}
