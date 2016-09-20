import { DashboardComponent } from './dashboard.component';

// import { LoginRoutes } from './login/login.routing';

export const DashboardRoutes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: {},
    children: [
      // ...LoginRoutes,
    ]
  }
];