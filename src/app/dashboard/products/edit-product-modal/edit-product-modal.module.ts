import { NgModule } from '@angular/core';

import { EditVendorModal } from './edit-vendor-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    EditVendorModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditVendorModal ]
})
export class EditVendorModalModule {
}