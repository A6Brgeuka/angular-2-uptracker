import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

// routings
import { AuthRoutes } from './auth/index';

const appRoutes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'dashboard', canLoad: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'onboard', canLoad: [AuthGuard], loadChildren: './onboard/onboard.module#OnboardModule' },
      ...AuthRoutes
    ]
  },
  { path: '**', component: NoContentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);