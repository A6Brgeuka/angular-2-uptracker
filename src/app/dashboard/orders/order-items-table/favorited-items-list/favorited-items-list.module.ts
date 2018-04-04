import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { FavoritedItemsListComponent } from './favorited-items-list.component';

@NgModule({
  declarations: [
    FavoritedItemsListComponent,
  ],
  exports: [FavoritedItemsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class FavoritedItemsListModule {

}
