import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import {
    UserCollectionResolve,
    LocationCollectionResolve,
    VendorCollectionResolve,
    AccountVendorCollectionResolve,
    ProductCollectionResolve,
} from '../shared/resolves/index';

import { OrdersRoutes } from './orders/orders.routing';
import { LocationsRoutes } from './locations/locations.routing';
import { UsersRoutes } from './users/users.routing';
import { VendorsRoutes } from './vendors/vendors.routing';
import { ProductsRoutes } from './products/products.routing';
import { InventoryRoutes } from "./inventory/inventory.routing";
import { TransferRoutes } from "./transfer/transfer.routing";
import { ShoppingListRoutes } from "./shopping-list/shopping-list.routing";

const dashboardRoutes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: "dashboard", pathMatch: "full" },
      ...OrdersRoutes,
      ...LocationsRoutes,
      ...UsersRoutes,
      ...VendorsRoutes,
      ...ProductsRoutes,
      ...InventoryRoutes,
      ...TransferRoutes,
      ...ShoppingListRoutes
    ],
    resolve: {
      accountVendorCollection: AccountVendorCollectionResolve,
      vendorCollection: VendorCollectionResolve,
      userCollection: UserCollectionResolve,
      locationCollection: LocationCollectionResolve,
      productCollection: ProductCollectionResolve,
    }
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(dashboardRoutes);