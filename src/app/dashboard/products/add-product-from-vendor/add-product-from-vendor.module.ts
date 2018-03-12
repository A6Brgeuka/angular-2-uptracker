import {NgModule} from "@angular/core";

import {AddProductFromVendorComponent} from "./add-product-from-vendor.component";
import {ProductVariantComponent} from "./product-variant/product-variant.component";
import { AppSharedModule } from '../../../shared/shared.module';
@NgModule({
  declarations: [
    AddProductFromVendorComponent,
    ProductVariantComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class AddProductFromVendorModule {
}
