import { AuthComponent } from './auth.component';
import { AuthGuard } from '../auth-guard.service';

import { EmailVerificationRoutes } from './email-verification/email-verification.routing';
import { LoginComponent } from './login/login.component';

export const AuthRoutes = [
  //{
  //  path: '',
  //  component: AuthComponent,
  //  children: [
  //    { path: 'login', canActivate: [AuthGuard], component: LoginComponent, },
  //    { path: 'signup', canLoad: [AuthGuard], loadChildren: './auth/signup/signup.module#SignupModule' },
  //    { path: 'forgot-password', canLoad: [AuthGuard], loadChildren: './auth/forgot-password/forgot-password.module#ForgotPasswordModule' },
  //    { path: 'forgot-password-congrats', loadChildren: './auth/forgot-password-congrats/forgot-password-congrats.module#ForgotPasswordCongratsModule' },
  //    { path: 'reset-password/:token', loadChildren: './auth/reset-password/reset-password.module#ResetPasswordModule' },
  //    //...EmailVerificationRoutes
  //  ]
  //}
];