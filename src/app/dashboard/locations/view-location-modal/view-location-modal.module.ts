import { NgModule } from '@angular/core';

import { ViewLocationModal } from './view-location-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ViewLocationModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ViewLocationModal ]
})
export class ViewLocationModalModule {
}