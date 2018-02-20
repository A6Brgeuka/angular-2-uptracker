import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrderTableModule } from '../directives/order-table/order-table.module';
import { FavoritedListComponent } from './favorited-list.component';
import { FavoritedListService } from './favorited-list.service';

@NgModule({
  declarations: [
    FavoritedListComponent,
  ],
  exports: [FavoritedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [
    FavoritedListService,
  ],
})
export class FavoritedListModule {

}
