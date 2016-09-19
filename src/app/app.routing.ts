import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { NoContent } from "./no-content";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";


const appRoutes: Routes = [
  {
    path: '',
    // resolve: {
    //   'selfData': GetSelfDataResolver
    // },
    component: AppComponent,
    children: [
      // ...LandingRoutes,
      // ...CrmRoutes,
      // ...FormRoutes,
    ]
  },
  {path: 'login', component: LoginComponent},
  // {path: '**', component: NoContent},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);