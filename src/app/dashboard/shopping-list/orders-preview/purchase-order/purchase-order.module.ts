import { NgModule } from '@angular/core';

import { PurchaseOrderComponent } from './purchase-order.component';
import { AppSharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    PurchaseOrderComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: []
})
export class PurchaseOrderModule {
}