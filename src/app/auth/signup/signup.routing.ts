import { SignupComponent } from './signup.component';

import { AboutCompanyRoutes } from './about-company/about-company.routing';
// import { ForgotPasswordRoutes } from './forgot-password/forgot-password.routing';
// import { ResetPasswordRoutes } from './reset-password/reset-password.routing';

export const SignupRoutes = [
  {
    path: 'signup',
    component: SignupComponent,
    resolve: {},
    children: [
      ...AboutCompanyRoutes,
      // ...ResetPasswordRoutes,
      // ...ForgotPasswordRoutes
    ]
  }
];