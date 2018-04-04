import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { ReconciledItemsListComponent } from './reconciled-items-list.component';

@NgModule({
  declarations: [
    ReconciledItemsListComponent,
  ],
  exports: [ReconciledItemsListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [],
})
export class ReconciledItemsListModule {

}
