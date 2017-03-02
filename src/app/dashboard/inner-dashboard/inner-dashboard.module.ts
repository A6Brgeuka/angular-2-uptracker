import { NgModule } from '@angular/core';

import { InnerDashboardComponent } from './inner-dashboard.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    InnerDashboardComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class InnerDashboardModule {
}