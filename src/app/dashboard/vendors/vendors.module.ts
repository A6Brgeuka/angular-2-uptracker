import { NgModule } from '@angular/core';

import { VendorsComponent } from './vendors.component';
import { AppSharedModule } from '../../shared/shared.module';
import { ViewVendorModule } from './view-vendor/view-vendor.module';
import { EditVendorModule } from './edit-vendor/edit-vendor.module';
import { VendorsTabModule } from './vendors-tab/vendors-tab.module';

@NgModule({
  declarations: [
    VendorsComponent,
  ],
  imports: [
    AppSharedModule,
    ViewVendorModule,
    EditVendorModule,
    VendorsTabModule,
  ],
  providers: []
})
export class VendorsModule {
}
