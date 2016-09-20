import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { AppSharedModule } from '../shared/shared.module';
// import { LoginModule } from './login/login.module';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    AppSharedModule,
      
    // LoginModule,
  ],
  providers: []
})
export class DashboardModule {
}