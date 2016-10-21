import { OnboardComponent } from './onboard.component';

import { AuthGuard } from '../auth-guard.service';

import { LocationsRoutes } from './locations/locations.routing';
import { UsersRoutes } from './users/users.routing';
import { AccountingRoutes } from './accounting/accounting.routing';

export const OnboardRoutes = [
  {
    path: 'onboard',
    component: OnboardComponent,
    resolve: {},
    canActivate: [ AuthGuard ],
    children: [
      ...LocationsRoutes,
      ...UsersRoutes,
      ...AccountingRoutes
    ]
  }
];