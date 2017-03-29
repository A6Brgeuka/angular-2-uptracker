import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

// routings
import { AuthRoutes } from './auth/index';
import { AuthComponent } from './auth/auth.component';
import { EmailVerificationRoutes } from './auth/email-verification/email-verification.routing';


const appRoutes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: "/login", pathMatch: "full" },
      { path: '', canLoad: [AuthGuard], loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'onboard', canLoad: [AuthGuard], loadChildren: './onboard/onboard.module#OnboardModule' },
      
      //...AuthRoutes
      // TODO remove after spread "...AuthRoutes" will work
      {
        path: '',
        component: AuthComponent,
        children: [
          { path: 'login', canLoad: [AuthGuard], loadChildren: './auth/login/login.module#LoginModule' },
          { path: 'signup', canLoad: [AuthGuard], loadChildren: './auth/signup/signup.module#SignupModule' },
          { path: 'forgot-password', canLoad: [AuthGuard], loadChildren: './auth/forgot-password/forgot-password.module#ForgotPasswordModule' },
          { path: 'forgot-password-congrats', loadChildren: './auth/forgot-password-congrats/forgot-password-congrats.module#ForgotPasswordCongratsModule' },
          { path: 'reset-password/:token', loadChildren: './auth/reset-password/reset-password.module#ResetPasswordModule' },
          ...EmailVerificationRoutes
    
        ]
      }
    ]
  },
  { path: '**', component: NoContentComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);