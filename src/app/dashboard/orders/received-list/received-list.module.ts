import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ReceivedListComponent } from './received-list.component';
import { OrderTableModule } from '../directives/order-table/order-table.module';
import { ReceivedListService } from './received-list.service';

@NgModule({
  declarations: [
    ReceivedListComponent,
  ],
  exports: [ReceivedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
  providers: [
    ReceivedListService,
  ],
})
export class ReceivedListModule {

}
