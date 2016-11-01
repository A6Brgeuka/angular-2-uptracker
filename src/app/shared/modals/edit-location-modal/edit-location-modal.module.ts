import { NgModule } from '@angular/core';

import { EditLocationModal } from './edit-location-modal.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
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
export class EditLocationModalModule {
}