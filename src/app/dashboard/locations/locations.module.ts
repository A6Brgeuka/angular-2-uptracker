import { NgModule } from '@angular/core';

import { LocationsComponent } from './locations.component';
import { AppSharedModule } from '../../shared/shared.module';
import { ViewLocationModule } from './view-location/view-location.module';


@NgModule({
  declarations: [
    LocationsComponent,
  ],
  imports: [
    AppSharedModule,
    ViewLocationModule
  ],
  providers: [],
})
export class LocationsModule {
}