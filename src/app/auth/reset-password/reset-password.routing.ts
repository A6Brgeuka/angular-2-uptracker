import { ResetPasswordComponent } from './reset-password.component';

export const ResetPasswordRoutes = [
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: []
  },
];