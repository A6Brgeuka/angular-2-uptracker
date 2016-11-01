import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { AppSharedModule } from '../shared/shared.module';

import { OrdersModule } from './orders/orders.module';
import { LocationsModule } from './locations/locations.module';
import { UsersModule } from './users/users.module';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    AppSharedModule,
      
    OrdersModule,
    LocationsModule,
    UsersModule
  ],
  providers: []
})
export class DashboardModule {
}