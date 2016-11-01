import { DashboardComponent } from './dashboard.component';

import { AuthGuard } from '../auth-guard.service';

import { OrdersRoutes } from './orders/orders.routing';
import { LocationsRoutes } from './locations/locations.routing';
import { UsersRoutes } from './users/users.routing';

export const DashboardRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: {},
    canActivate: [ AuthGuard ],
    children: [
      ...OrdersRoutes,
      ...LocationsRoutes,
      ...UsersRoutes,
    ]
  }
];