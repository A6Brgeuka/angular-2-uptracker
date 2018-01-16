import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ReceivedListComponent } from './received-list.component';
import { ReceivedListShortDetailComponent } from './received-list-short-detail/received-list-short-detail.component';
import { OrderTableModule } from '../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    ReceivedListComponent,
    ReceivedListShortDetailComponent
  ],
  exports: [ReceivedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
  providers: [],
})
export class ReceivedListModule {

}