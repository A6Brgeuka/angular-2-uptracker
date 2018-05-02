import {NgModule} from '@angular/core';

import {AddProductFromVendorComponent} from "./add-product-from-vendor.component";
import {AppSharedModule} from '../../../shared/shared.module';
import {AddProductFromVendorStep1Module} from "./step1/add-product-from-vendor-step1.module";
import {AddProductFromVendorStep2Module} from "./step2/add-product-from-vendor-step2.module";

@NgModule({
  declarations: [
    AddProductFromVendorComponent
  ],
  imports: [
    AppSharedModule,
    AddProductFromVendorStep1Module,
    AddProductFromVendorStep2Module
  ],
  providers: [],
  entryComponents: [
    AddProductFromVendorComponent
  ]
})
export class AddProductFromVendorModule {
}
