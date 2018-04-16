import { NgModule } from '@angular/core';
import {ScannerModule} from "../../../dashboard/scanner/scanner.module";
import {ProductVariantComponent} from "./product-variant.component";
import {AppSharedModule} from "../../shared.module";

@NgModule({
  declarations: [
    ProductVariantComponent,
  ],
  imports: [
    AppSharedModule,
    ScannerModule
  ],
  exports: [
    ProductVariantComponent
  ],
  providers: [],
})
export class ProductVariantModule {}
