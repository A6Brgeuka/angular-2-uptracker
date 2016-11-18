import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

// routings
import { AuthRoutes } from './auth/index';
// import { DashboardRoutes } from './dashboard/index';
import { OnboardRoutes } from './onboard/index';

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    canActivateChild: [ AuthGuard ],
    children: [
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      ...AuthRoutes,
      // ...DashboardRoutes,
      ...OnboardRoutes
    ]
  },
  { path: '**', component: NoContentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);