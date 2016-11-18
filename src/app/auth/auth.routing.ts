// import { ModuleWithProviders } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { AuthGuard } from '../auth-guard.service';

// import { LoginRoutes } from './login/login.routing';
// import { ForgotPasswordRoutes } from './forgot-password/forgot-password.routing';
// import { ResetPasswordRoutes } from './reset-password/reset-password.routing';
// import { SignupRoutes } from './signup/signup.routing';
// import { ForgotPasswordCongratsRoutes } from './forgot-password-congrats/forgot-password-congrats.routing';
import { EmailVerificationRoutes } from './email-verification/email-verification.routing';

export const AuthRoutes = [
// const authRoutes = [
  {
    path: '',
    component: AuthComponent,
    resolve: {},
    // canActivate: [ AuthGuard ],
    children: [
      { path: 'signup', canLoad: [AuthGuard], loadChildren: './signup/signup.module#SignupModule' },
      { path: 'login', canLoad: [AuthGuard], loadChildren: './login/login.module#LoginModule' },
      { path: 'forgot-password', canLoad: [AuthGuard], loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
      { path: 'forgot-password-congrats', loadChildren: './forgot-password-congrats/forgot-password-congrats.module#ForgotPasswordCongratsModule' },
      { path: 'reset-password/:token', loadChildren: './reset-password/reset-password.module#ResetPasswordModule' },
      // ...LoginRoutes,
      // ...ResetPasswordRoutes,
      // ...ForgotPasswordRoutes,
      // ...SignupRoutes,
      // ...ForgotPasswordCongratsRoutes,
      ...EmailVerificationRoutes
    ]
  }
];

// export const routing: ModuleWithProviders = RouterModule.forChild(authRoutes);