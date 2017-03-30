import { AuthComponent } from './auth.component';
import { AuthGuard } from '../auth-guard.service';

import { EmailVerificationRoutes } from './email-verification/email-verification.routing';

import { ForgotPasswordRoutes } from './forgot-password/forgot-password.routing';
import { ForgotPasswordCongratsRoutes } from './forgot-password-congrats/forgot-password-congrats.routing';
import { LoginRoutes } from './login/login.routing';
import { SignupRoutes } from './signup/signup.routing';
import { ResetPasswordRoutes } from './reset-password/reset-password.routing';

export const AuthRoutes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      //{ path: 'login', canActivate: [AuthGuard], component: LoginComponent, },
      //{ path: 'signup', canActivate: [AuthGuard], component: SignupComponent },
      //{ path: 'forgot-password', canActivate: [AuthGuard], component: ForgotPasswordComponent },
      //{ path: 'forgot-password-congrats', component: ForgotPasswordCongratsComponent },
      //{ path: 'reset-password/:token', component: ResetPasswordComponent },
      ...EmailVerificationRoutes,
      ...ForgotPasswordRoutes,
      ...ForgotPasswordCongratsRoutes,
      ...LoginRoutes,
      ...SignupRoutes,
      ...ResetPasswordRoutes,
    ]
  }
];