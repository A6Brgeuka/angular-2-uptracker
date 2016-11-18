import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupComponent } from './signup.component';

import { AboutCompanyRoutes } from './about-company/about-company.routing';
import { CreateAccountRoutes } from './create-account/create-account.routing';
import { PaymentInfoRoutes } from './payment-info/payment-info.routing';
import { CongratsRoutes } from './congrats/congrats.routing';

const signupRoutes = [
  {
    path: '',
    component: SignupComponent,
    resolve: {},
    children: [
      ...AboutCompanyRoutes,
      ...CreateAccountRoutes,
      ...PaymentInfoRoutes,
      ...CongratsRoutes
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(signupRoutes);