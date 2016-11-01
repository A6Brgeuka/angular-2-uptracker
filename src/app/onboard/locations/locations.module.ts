import { NgModule } from '@angular/core';

import { OnboardLocationsComponent } from './locations.component';
import { AppSharedModule } from '../../shared/shared.module';

import { EditLocationModal } from '../../shared/modals/index';

@NgModule({
  declarations: [
    OnboardLocationsComponent,
    EditLocationModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditLocationModal ]
})
export class OnboardLocationsModule {
}