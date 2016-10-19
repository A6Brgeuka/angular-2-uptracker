import { LoginComponent } from './login.component';
import { AuthGuard } from '../../auth-guard.service';

export const LoginRoutes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ AuthGuard ]
  },
];