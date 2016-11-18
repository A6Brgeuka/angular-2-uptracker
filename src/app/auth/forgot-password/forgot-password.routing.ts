import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';
// import { AuthGuard } from '../../auth-guard.service';

// export const ForgotPasswordRoutes = [
const forgotPasswordRoutes = [
  {
    // path: 'forgot-password',
    path: '',
    component: ForgotPasswordComponent,
    // canActivate: [ AuthGuard ]
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(forgotPasswordRoutes);