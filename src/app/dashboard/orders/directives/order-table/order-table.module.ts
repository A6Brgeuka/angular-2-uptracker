import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableComponent } from './order-table.component';
import { OrderTableHeaderActionComponent } from './components/order-table-header-action.component';


@NgModule({
  declarations: [
    OrderTableComponent,
    OrderTableHeaderActionComponent,
  ],
  exports: [OrderTableComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [
  ],
})
export class OrderTableModule {

}
