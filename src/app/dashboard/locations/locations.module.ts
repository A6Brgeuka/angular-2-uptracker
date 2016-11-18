import { NgModule } from '@angular/core';

import { LocationsComponent } from './locations.component';
import { AppSharedModule } from '../../shared/shared.module';

// import { EditLocationModalModule } from '../../shared/modals/index';
import { ViewLocationModalModule } from './view-location-modal/view-location-modal.module';
// import { EditLocationModal } from '../../shared/modals/edit-location-modal/edit-location-modal.component';

@NgModule({
  declarations: [
    LocationsComponent,
    // EditLocationModal
  ],
  imports: [
    AppSharedModule,
    // EditLocationModalModule,
    ViewLocationModalModule
  ],
  providers: [],
  // entryComponents: [ EditLocationModal ]
})
export class LocationsModule {
}