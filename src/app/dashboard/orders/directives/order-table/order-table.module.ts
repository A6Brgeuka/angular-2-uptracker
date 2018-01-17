import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableComponent } from './order-table.component';
//import { OrderTableSortService } from './order-table-sort.service';
//import { AllOrdersActionComponent } from '../../all-orders-list/all-orders-action/all-orders-action.component';

@NgModule({
  declarations: [
    OrderTableComponent,
    //AllOrdersActionComponent
  ],
  exports: [OrderTableComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [
    //OrderTableSortService
  ],
})
export class OrderTableModule {

}
