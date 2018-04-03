import { NgModule } from '@angular/core';

import { ReconciledListComponent } from './reconciled-list.component';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableModule } from '../../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    ReconciledListComponent,
  ],
  exports: [ReconciledListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [],
})
export class ReconciledListModule {

}
