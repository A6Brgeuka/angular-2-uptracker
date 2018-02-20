import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ClosedListComponent } from './closed-list.component';
import { OrderTableModule } from '../directives/order-table/order-table.module';
import { ClosedListService } from './closed-list.service';

@NgModule({
  declarations: [
    ClosedListComponent,
  ],
  exports: [ClosedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [
    ClosedListService,
  ],
})
export class ClosedListModule {

}
