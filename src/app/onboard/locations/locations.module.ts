import { NgModule } from '@angular/core';

import { LocationsComponent } from './locations.component';
import { StateCollectionResolve } from './locations-resolve.service';
import { AppSharedModule } from '../../shared/shared.module';

import { LocationModal } from './location-modal/location-modal.component';

@NgModule({
  declarations: [
    LocationsComponent,
    LocationModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [
    StateCollectionResolve
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ LocationModal ]
})
export class LocationsModule {
}