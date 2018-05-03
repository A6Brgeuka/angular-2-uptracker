import {NgModule} from '@angular/core';
import {AddProductFromVendorStep2Component} from "./add-product-from-vendor-step2.component";
import {VendorProductVariantsModule} from "../../vendor-product-variants/vendor-product-variants.module";
import {AppSharedModule} from "../../../../shared/shared.module";

@NgModule({
  declarations: [
    AddProductFromVendorStep2Component
  ],
  imports: [
    AppSharedModule,
    VendorProductVariantsModule
  ],
  exports: [
    AddProductFromVendorStep2Component
  ],
  providers: [],
  entryComponents: [
    AddProductFromVendorStep2Component
  ]
})
export class AddProductFromVendorStep2Module {
}
