import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { BackorderedListComponent } from './backordered-list.component';
import { OrderTableModule } from '../directives/order-table/order-table.module';
import { BackorderedListService } from './backordered-list.service';

@NgModule({
  declarations: [
    BackorderedListComponent,
  ],
  exports: [BackorderedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [
    BackorderedListService,
  ],
})
export class BackorderedListModule {

}
