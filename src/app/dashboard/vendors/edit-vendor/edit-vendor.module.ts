import { NgModule } from '@angular/core';

import { EditVendorComponent } from './edit-vendor.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditVendorComponent
  ],
  imports: [
    AppSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditVendorComponent ]
})
export class EditVendorModule {
}