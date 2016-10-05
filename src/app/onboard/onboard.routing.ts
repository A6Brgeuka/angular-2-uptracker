import { OnboardComponent } from './onboard.component';

import { LocationsRoutes } from './locations/locations.routing';
import { UsersRoutes } from './users/users.routing';
// import { ResetPasswordRoutes } from './reset-password/reset-password.routing';
// import { SignupRoutes } from './signup/signup.routing';

export const OnboardRoutes = [
  {
    path: 'onboard',
    component: OnboardComponent,
    resolve: {},
    children: [
      ...LocationsRoutes,
      ...UsersRoutes,
      // ...ForgotPasswordRoutes,
      // ...SignupRoutes
    ]
  }
];