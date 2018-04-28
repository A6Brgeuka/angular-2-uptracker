import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductVariantModule} from "./product-variant/product-variant.module";
import {VendorProductVariantsComponent} from "./vendor-product-variants.component";

@NgModule({
  imports: [
    ProductVariantModule,
    CommonModule
  ],
  declarations: [
    VendorProductVariantsComponent
  ],
  exports: [
    VendorProductVariantsComponent
  ]
})
export class VendorProductVariantsModule { }
