import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';

// routings
import { AuthRoutes } from './auth/index';
import { DashboardRoutes } from './dashboard/index';
import { OnboardRoutes } from './onboard/index';

// resolver
import {
    GetSelfDataResolve
} from './app-resolve.service';

const appRoutes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      ...AuthRoutes,
      ...DashboardRoutes,
      ...OnboardRoutes
    ],
    resolve: {
      'selfData': GetSelfDataResolve
    }
  },
  { path: '**', component: NoContentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);