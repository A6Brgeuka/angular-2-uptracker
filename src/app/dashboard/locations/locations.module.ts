import { NgModule } from '@angular/core';

import { LocationsComponent } from './locations.component';
import { AppSharedModule } from '../../shared/shared.module';

import { EditLocationModalModule } from '../../shared/modals/index';
import { ViewLocationModalModule } from './view-location-modal/view-location-modal.module';

@NgModule({
  declarations: [
    LocationsComponent,
  ],
  imports: [
    AppSharedModule,
    EditLocationModalModule,
    ViewLocationModalModule
  ],
  providers: []
})
export class LocationsModule {
}