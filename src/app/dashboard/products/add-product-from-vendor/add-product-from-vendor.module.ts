import {NgModule} from '@angular/core';

import {AddProductFromVendorStep1Component} from './add-product-from-vendor-step1.component';
import {AddProductFromVendorStep2Component} from './add-product-from-vendor-step2.component';
import {ProductVariantComponent} from './product-variant/product-variant.component';
import { AppSharedModule } from '../../../shared/shared.module';
@NgModule({
  declarations: [
    AddProductFromVendorStep1Component,
    AddProductFromVendorStep2Component,
    ProductVariantComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class AddProductFromVendorModule {
}
