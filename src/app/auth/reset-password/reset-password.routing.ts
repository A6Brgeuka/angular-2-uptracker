import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';

const resetPasswordRoutes = [
  {
    path: '',
    component: ResetPasswordComponent,
    canActivate: []
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(resetPasswordRoutes);