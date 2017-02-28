import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { AppSharedModule } from '../shared/shared.module';

import { OrdersModule } from './orders/orders.module';
import { LocationsModule } from './locations/locations.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from "./inventory/inventory.module";
import { TranseferModule } from "./transfer/transfer.module";
import { ShoppingListModule } from "./shopping-list/shopping-list.module";

// for lazy loading
import { routing } from './index';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    routing,
    AppSharedModule,
      
    OrdersModule,
    LocationsModule,
    UsersModule,
    VendorsModule,
    ProductsModule,
    InventoryModule,
    TranseferModule,
    ShoppingListModule
  ],
  providers: []
})
export class DashboardModule {
}