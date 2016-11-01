import { DashboardComponent } from './dashboard.component';

import { AuthGuard } from '../auth-guard.service';

import { LocationsRoutes } from './locations/locations.routing';

export const DashboardRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: {},
    canActivate: [ AuthGuard ],
    children: [
      ...LocationsRoutes,
    ]
  }
];