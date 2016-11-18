import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';

const forgotPasswordRoutes = [
  {
    path: '',
    component: ForgotPasswordComponent,
  },
];

export const routing: ModuleWithProviders = RouterModule.forChild(forgotPasswordRoutes);