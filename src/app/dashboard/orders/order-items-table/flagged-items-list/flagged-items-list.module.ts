import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { FlaggedItemsListComponent } from './flagged-items-list.component';

@NgModule({
  declarations: [
    FlaggedItemsListComponent,
  ],
  exports: [FlaggedItemsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class FlaggedItemsListModule {

}
