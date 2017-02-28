import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

// routings
import { AuthRoutes } from './auth/index';
import { DashboardRoutes } from './dashboard/index';

const appRoutes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: "/dashboard", pathMatch: "full" },
      { path: 'dashboard', canLoad: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'onboard', canLoad: [AuthGuard], loadChildren: './onboard/onboard.module#OnboardModule' },
      { path: 'products', canLoad: [AuthGuard], loadChildren: './dashboard/products/products.module#ProductsModule' },
      ...AuthRoutes,
      ...DashboardRoutes
    ]
  },
  { path: '**', component: NoContentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);