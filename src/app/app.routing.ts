import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';

// routings
import { AuthRoutes } from './auth/index';
import { DashboardRoutes } from './dashboard/index';
import { OnboardRoutes } from './onboard/index';


const appRoutes: Routes = [
  {
    path: '',
    // resolve: {
    //   'selfData': GetSelfDataResolver
    // },
    component: AppComponent,
    children: [
      ...AuthRoutes,
      ...DashboardRoutes,
      ...OnboardRoutes
    ]
  },
  {path: '**', component: NoContentComponent}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);