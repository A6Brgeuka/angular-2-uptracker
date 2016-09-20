import { AuthComponent } from './auth.component';

import { LoginRoutes } from './login/login.routing';
import { ForgotPasswordRoutes } from './forgot-password/forgot-password.routing';
import { ResetPasswordRoutes } from './reset-password/reset-password.routing';
import { SignupRoutes } from './signup/signup.routing';

export const AuthRoutes = [
  {
    path: '',
    component: AuthComponent,
    resolve: {},
    children: [
      ...LoginRoutes,
      ...ResetPasswordRoutes,
      ...ForgotPasswordRoutes,
      ...SignupRoutes
    ]
  }
];