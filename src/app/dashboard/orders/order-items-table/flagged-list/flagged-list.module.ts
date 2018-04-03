import { NgModule } from '@angular/core';

import { FlaggedListComponent } from './flagged-list.component';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    FlaggedListComponent,
  ],
  exports: [FlaggedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class FlaggedListModule {

}
