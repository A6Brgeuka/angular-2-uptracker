import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { OpenItemsListComponent } from './open-items-list.component';

@NgModule({
  declarations: [
    OpenItemsListComponent,
  ],
  exports: [OpenItemsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
})
export class OpenItemsListModule {

}
