import { NgModule } from '@angular/core';

import { VendorsComponent } from './vendors.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditVendorModalModule } from './edit-vendor-modal/edit-vendor-modal.module';
import { ViewVendorModalModule } from './view-vendor-modal/view-vendor-modal.module';

@NgModule({
  declarations: [
    VendorsComponent,
  ],
  imports: [
    AppSharedModule,
    EditVendorModalModule,
    ViewVendorModalModule
  ],
  providers: []
})
export class VendorsModule {
}