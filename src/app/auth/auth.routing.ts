import { AuthComponent } from './auth.component';

import { LoginRoutes } from './login/login.routing';
import { ForgotPasswordRoutes } from './forgot-password/forgot-password.routing';
import { ResetPasswordRoutes } from './reset-password/reset-password.routing';
import { SignupRoutes } from './signup/signup.routing';
import { ForgotPasswordCongratsRoutes } from './forgot-password-congrats/forgot-password-congrats.routing';
import { EmailVerificationRoutes } from './email-verification/email-verification.routing';

export const AuthRoutes = [
  {
    path: '',
    component: AuthComponent,
    resolve: {},
    children: [
      ...LoginRoutes,
      ...ResetPasswordRoutes,
      ...ForgotPasswordRoutes,
      ...SignupRoutes,
      ...ForgotPasswordCongratsRoutes,
      ...EmailVerificationRoutes
    ]
  }
];