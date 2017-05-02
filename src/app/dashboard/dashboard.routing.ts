import { DashboardComponent } from './dashboard.component';

import {
    UserCollectionResolve,
    LocationCollectionResolve,
    VendorCollectionResolve,
    AccountVendorCollectionResolve,
    ProductCollectionResolve,
} from '../shared/resolves/index';

import { InnerDashboardRoutes } from './inner-dashboard/inner-dashboard.routing';
import { OrdersRoutes } from './orders/orders.routing';
import { LocationsRoutes } from './locations/locations.routing';
import { UsersRoutes } from './users/users.routing';
import { VendorsRoutes } from './vendors/vendors.routing';
import { ProductsRoutes } from './products/products.routing';
import { InventoryRoutes } from "./inventory/inventory.routing";
import { TransferRoutes } from "./transfer/transfer.routing";
import { ShoppingListRoutes } from "./shopping-list/shopping-list.routing";
import { homeRoutes } from './products/home/home.routing';
import { AuthGuard } from '../auth-guard.service';
import { OrdersPreviewRoutes } from './shopping-list/orders-preview/orders-preview.routing';


export const DashboardRoutes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      ...InnerDashboardRoutes,
      ...OrdersRoutes,
      ...LocationsRoutes,
      ...UsersRoutes,
      ...VendorsRoutes,
      ...ProductsRoutes,
      ...InventoryRoutes,
      ...TransferRoutes,
      ...ShoppingListRoutes,
      ...homeRoutes,
      ...OrdersPreviewRoutes
    ],
    canActivate: [AuthGuard],
    resolve: {
      accountVendorCollection: AccountVendorCollectionResolve,
      vendorCollection: VendorCollectionResolve,
      userCollection: UserCollectionResolve,
      locationCollection: LocationCollectionResolve,
      productCollection: ProductCollectionResolve,
    }
  }
];

