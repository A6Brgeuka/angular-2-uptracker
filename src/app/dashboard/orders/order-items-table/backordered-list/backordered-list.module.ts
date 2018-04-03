import { NgModule } from '@angular/core';

import { BackorderedListComponent } from './backordered-list.component';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    BackorderedListComponent,
  ],
  exports: [BackorderedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class BackorderedListModule {

}
