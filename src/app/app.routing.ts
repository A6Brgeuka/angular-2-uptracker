import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

// routings
import { AuthRoutes } from './auth/index';
// import { DashboardRoutes } from './dashboard/index';
// import { OnboardRoutes } from './onboard/index';

const appRoutes = [
  {
    path: '',
    component: AppComponent,
    // canActivate: [ AuthGuard ],
    children: [
      // { path: '', canLoad: [AuthGuard], loadChildren: './auth/auth.module#AuthModule' },
      { path: 'dashboard', canLoad: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'onboard', canLoad: [AuthGuard], loadChildren: './onboard/onboard.module#OnboardModule' },
      ...AuthRoutes,
      // ...DashboardRoutes,
      // ...OnboardRoutes
    ]
  },
  { path: '**', component: NoContentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);