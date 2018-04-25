import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { BackorderedItemsListComponent } from './backordered-items-list.component';

@NgModule({
  declarations: [
    BackorderedItemsListComponent,
  ],
  exports: [BackorderedItemsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class BackorderedItemsListModule {

}
