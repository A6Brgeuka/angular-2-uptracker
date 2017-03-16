import { NgModule } from '@angular/core';

import { EditVendorComponent } from './edit-vendor.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    EditVendorComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditVendorComponent ]
})
export class EditVendorModule {
}