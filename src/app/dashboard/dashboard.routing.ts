import { DashboardComponent } from './dashboard.component';

import { AuthGuard } from '../auth-guard.service';
import {
    UserCollectionResolve,
    LocationCollectionResolve,
    VendorCollectionResolve,
    AccountVendorCollectionResolve
} from '../shared/resolves/index';

import { OrdersRoutes } from './orders/orders.routing';
import { LocationsRoutes } from './locations/locations.routing';
import { UsersRoutes } from './users/users.routing';
import { VendorsRoutes } from './vendors/vendors.routing';

export const DashboardRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '' },
      ...OrdersRoutes,
      ...LocationsRoutes,
      ...UsersRoutes,
      ...VendorsRoutes
    ],
    resolve: {
      accountVendorCollection: AccountVendorCollectionResolve,
      vendorCollection: VendorCollectionResolve,
      userCollection: UserCollectionResolve,
      locationCollection: LocationCollectionResolve,
    }
  }
];