import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { FavoritedOrdersListComponent } from './favorited-orders-list.component';

@NgModule({
  declarations: [
    FavoritedOrdersListComponent,
  ],
  exports: [FavoritedOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class FavoritedOrdersListModule {

}
