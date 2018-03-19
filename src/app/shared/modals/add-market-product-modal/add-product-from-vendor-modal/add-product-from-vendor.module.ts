import {NgModule} from '@angular/core';

import {AddProductFromVendorStep1Component} from './step1/add-product-from-vendor-step1.component';
import {AddProductFromVendorStep2Component} from './step2/add-product-from-vendor-step2.component';
import {ProductVariantComponent} from './product-variant/product-variant.component';
import { AppSharedModule } from '../../../shared.module';
import {AddProductFromVendorModalComponent} from "./add-product-from-vendor.component";
@NgModule({
  declarations: [
    AddProductFromVendorStep1Component,
    AddProductFromVendorStep2Component,
    ProductVariantComponent,
    AddProductFromVendorModalComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  entryComponents: [
    AddProductFromVendorStep1Component,
    AddProductFromVendorStep2Component,
    ProductVariantComponent,
    AddProductFromVendorModalComponent
  ]
})
export class AddProductFromVendorModule {
}
