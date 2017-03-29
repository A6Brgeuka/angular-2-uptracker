import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

// routings
import { AuthRoutes } from './auth/index';


let appRoutes : any[]= [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: "/login", pathMatch: "full" },
      { path: '', canLoad: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'onboard', canLoad: [AuthGuard], loadChildren: './onboard/onboard.module#OnboardModule' },
      //...AuthRoutes
    ]
  },
  { path: '**', component: NoContentComponent }
];

// TODO remove after spread "...AuthRoutes" will work
appRoutes[0].children = appRoutes[0].children.concat(AuthRoutes);

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);