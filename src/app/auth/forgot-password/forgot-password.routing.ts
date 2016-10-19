import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthGuard } from '../../auth-guard.service';

export const ForgotPasswordRoutes = [
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [ AuthGuard ]
  },
];