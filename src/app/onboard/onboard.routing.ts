import { OnboardComponent } from './onboard.component';

import { AuthGuard } from '../auth-guard.service';

import { OnboardLocationsRoutes } from './locations/locations.routing';
import { OnboardUsersRoutes } from './users/users.routing';
import { AccountingRoutes } from './accounting/accounting.routing';

export const OnboardRoutes = [
  {
    path: 'onboard',
    component: OnboardComponent,
    resolve: {},
    canActivate: [ AuthGuard ],
    children: [
      ...OnboardLocationsRoutes,
      ...OnboardUsersRoutes,
      ...AccountingRoutes
    ]
  }
];