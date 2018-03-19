import { NgModule } from '@angular/core';

import { ScannerModule } from '../../../dashboard/scanner/scanner.module';
import { AddMarketProductModalComponent } from './add-market-product-modal.component';
import { AppSharedModule } from '../../shared.module';
import { BrowseGlobalMarketModalModule } from './browse-global-market-modal/browse-global-market-modal.module';
import { AddNewProductModalModule } from './add-new-product-modal/add-new-product-modal.module';
import {AddProductFromVendorModule} from "./add-product-from-vendor-modal/add-product-from-vendor.module";

@NgModule({
  declarations: [
    AddMarketProductModalComponent,
  ],
  imports: [
    AppSharedModule,
    ScannerModule,
    AddNewProductModalModule,
    BrowseGlobalMarketModalModule,
    AddProductFromVendorModule
  ],
  providers: [],
  exports: [
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [AddMarketProductModalComponent]
})
export class AddMarketProductModalModule {

}
