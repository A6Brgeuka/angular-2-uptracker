import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { AppSharedModule } from '../shared/shared.module';

import { InnerDashboardModule } from './inner-dashboard/inner-dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { LocationsModule } from './locations/locations.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from "./inventory/inventory.module";
import { TranseferModule } from "./transfer/transfer.module";
import { ShoppingListModule } from "./shopping-list/shopping-list.module";

// for lazy loading
//import { routing } from './index';
import { HomeModule } from './products/home/home.module';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    //routing,
    AppSharedModule,
  
    InnerDashboardModule,
    OrdersModule,
    LocationsModule,
    UsersModule,
    VendorsModule,
    ProductsModule,
    InventoryModule,
    TranseferModule,
    ShoppingListModule,
    HomeModule
  ],
  providers: []
})
export class DashboardModule {
}