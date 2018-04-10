import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { ReconciledOrdersListComponent } from './reconciled-orders-list.component';

@NgModule({
  declarations: [
    ReconciledOrdersListComponent,
  ],
  exports: [ReconciledOrdersListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule
  ],
})
export class ReconciledOrdersListModule {

}
