import { SignupComponent } from './signup.component';
import { AuthGuard } from '../../auth-guard.service';

import { AboutCompanyRoutes } from './about-company/about-company.routing';
import { CreateAccountRoutes } from './create-account/create-account.routing';
import { PaymentInfoRoutes } from './payment-info/payment-info.routing';
import { CongratsRoutes } from './congrats/congrats.routing';

export const SignupRoutes = [
  {
    path: 'signup',
    component: SignupComponent,
    resolve: {},
    canActivate: [ AuthGuard ],
    children: [
      ...AboutCompanyRoutes,
      ...CreateAccountRoutes,
      ...PaymentInfoRoutes,
      ...CongratsRoutes
    ]
  }
];