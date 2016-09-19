import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoContentComponent } from './no-content/index';
import { AppComponent } from './app.component';

// routings
import { AuthRoutes } from './auth/index';


const appRoutes: Routes = [
  {
    path: '',
    // resolve: {
    //   'selfData': GetSelfDataResolver
    // },
    component: AppComponent,
    children: [
      ...AuthRoutes,
      // ...CrmRoutes,
      // ...FormRoutes,
    ]
  },
  {path: '**', component: NoContentComponent},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);