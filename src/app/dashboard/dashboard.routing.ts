import { DashboardComponent } from './dashboard.component';

import { AuthGuard } from '../auth-guard.service';

// import { LoginRoutes } from './login/login.routing';

export const DashboardRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: {},
    canActivate: [ AuthGuard ],
    children: [
      // ...LoginRoutes,
    ]
  }
];