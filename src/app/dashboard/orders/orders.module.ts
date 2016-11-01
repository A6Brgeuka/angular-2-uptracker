import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class OrdersModule {
}