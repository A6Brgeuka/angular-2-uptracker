import { NgModule } from '@angular/core';

import { OrderTableModule } from '../../directives/order-table/order-table.module';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OpenInvoicesListComponent } from './open-invoices-list.component';

@NgModule({
  declarations: [
    OpenInvoicesListComponent,
  ],
  exports: [OpenInvoicesListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class OpenInvoicesListModule {

}
