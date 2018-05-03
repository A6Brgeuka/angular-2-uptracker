import { NgModule } from '@angular/core';
import {ProductVariantComponent} from "./product-variant.component";
import {VendorProductPackageComponent} from "../vendor-product-package/vendor-product-package.component";
import {DropdownPackageModule} from "../dropdown-package/dropdown-package.module";
import {AppSharedModule} from "../../../../shared/shared.module";

@NgModule({
  declarations: [
    ProductVariantComponent,
    VendorProductPackageComponent
  ],
  imports: [
    AppSharedModule,
    DropdownPackageModule

  ],
  exports: [
    ProductVariantComponent
  ],
  providers: [],
})
export class ProductVariantModule {}
