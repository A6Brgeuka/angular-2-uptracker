import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrderTableModule } from '../directives/order-table/order-table.module';
import { FlaggedListComponent } from './flagged-list.component';
import { FlaggedListService } from './flagged-list.service';

@NgModule({
  declarations: [
    FlaggedListComponent,
  ],
  exports: [FlaggedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [
    FlaggedListService,
  ],
})
export class FlaggedListModule {

}
