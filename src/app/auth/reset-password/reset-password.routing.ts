import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';

// export const ResetPasswordRoutes = [
const resetPasswordRoutes = [
  {
    // path: 'reset-password/:token',
    path: '',
    component: ResetPasswordComponent,
    canActivate: []
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(resetPasswordRoutes);