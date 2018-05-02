import {NgModule} from '@angular/core';
import {AddProductFromVendorStep1Component} from "./add-product-from-vendor-step1.component";
import {AppSharedModule} from "../../../../shared/shared.module";

@NgModule({
  declarations: [
    AddProductFromVendorStep1Component
  ],
  imports: [
    AppSharedModule
  ],
  exports: [
    AddProductFromVendorStep1Component
  ],
  entryComponents: [
    AddProductFromVendorStep1Component
  ]
})
export class AddProductFromVendorStep1Module {
}
