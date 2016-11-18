import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordCongratsComponent } from './forgot-password-congrats.component';

const forgotPasswordCongratsRoutes = [
  {
    path: '',
    component: ForgotPasswordCongratsComponent,
    canActivate: []
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(forgotPasswordCongratsRoutes);