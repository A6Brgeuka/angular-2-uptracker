import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { AppSharedModule } from '../shared/shared.module';
import { LocationsModule } from './locations/locations.module';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    AppSharedModule,
      
    LocationsModule,
  ],
  providers: []
})
export class DashboardModule {
}