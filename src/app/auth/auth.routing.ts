import { AuthComponent } from './auth.component';

import { LoginRoutes } from './login/login.routing';
import { ForgotPasswordRoutes } from './forgot-password/forgot-password.routing';

// import { UpdatePasswordRoutes } from './update-password/update-password.routing';

export const AuthRoutes = [
  {
    path: '',
    component: AuthComponent,
    resolve: {},
    children: [
      ...LoginRoutes,
      // ...UpdatePasswordRoutes,
      ...ForgotPasswordRoutes
    ]
  }
];