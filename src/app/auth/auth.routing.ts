import { AuthComponent } from './auth.component';

import { LoginRoutes } from './login/login.routing';

// import {UpdatePasswordRoutes} from "./update-password/update-password.routes";
// import {ForgotPasswordRoutes} from "./forgot-password/forgot-password.routes";

export const AuthRoutes = [
  {
    path: '',
    component: AuthComponent,
    resolve: {},
    children: [
      ...LoginRoutes,
      // ...UpdatePasswordRoutes,
      // ...ForgotPasswordRoutes
    ]
  }
];