import { NgModule } from '@angular/core';

import { ClosedListComponent } from './closed-list.component';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    ClosedListComponent,
  ],
  exports: [ClosedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class ClosedListModule {

}
