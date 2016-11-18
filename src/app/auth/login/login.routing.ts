import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
// import { AuthGuard } from '../../auth-guard.service';

// export const LoginRoutes = [
export const loginRoutes = [
  {
    // path: 'login',
    path: '',
    component: LoginComponent,
    // canActivate: [ AuthGuard ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(loginRoutes);