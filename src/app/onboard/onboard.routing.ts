import { OnboardComponent } from './onboard.component';

import { AuthGuard } from '../auth-guard.service';

import { LocationsRoutes } from './locations/locations.routing';
import { UsersRoutes } from './users/users.routing';
import { ProductsRoutes } from './products/products.routing';

export const OnboardRoutes = [
  {
    path: 'onboard',
    component: OnboardComponent,
    resolve: {},
    canActivate: [ AuthGuard ],
    children: [
      ...LocationsRoutes,
      ...UsersRoutes,
      ...ProductsRoutes,
    ]
  }
];