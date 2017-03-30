import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

// routings
import { AuthRoutes } from './auth/index';
import { AuthComponent } from './auth/auth.component';
import { EmailVerificationRoutes } from './auth/email-verification/email-verification.routing';

import { DashboardComponent } from './dashboard/dashboard.component';
import { OnboardComponent } from './onboard/onboard.component';
import { DashboardRoutes } from './dashboard/dashboard.routing';
import { OnboardRoutes } from './onboard/onboard.routing';


const appRoutes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: "/login", pathMatch: "full" },
      //{ path: '', canActivate: [AuthGuard], component: DashboardComponent },
      //{ path: 'onboard', canActivate: [AuthGuard], component: OnboardComponent },

      ...AuthRoutes,
      ...DashboardRoutes,
      ...OnboardRoutes
    ]
  },
  { path: '**', component: NoContentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);