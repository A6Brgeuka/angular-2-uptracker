import { NgModule } from '@angular/core';

import { VendorsComponent } from './vendors.component';
import { AppSharedModule } from '../../shared/shared.module';
import { ViewVendorComponent } from './view-vendor/view-vendor.component';

@NgModule({
  declarations: [
    VendorsComponent,
    ViewVendorComponent
  ],
  imports: [
    AppSharedModule,
  ],
  providers: []
})
export class VendorsModule {
}