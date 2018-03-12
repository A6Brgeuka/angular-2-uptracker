import { NgModule } from '@angular/core';

import { ScannerModule } from '../../../dashboard/scanner/scanner.module';
import { AddMarketProductModalComponent } from './add-market-product-modal.component';
import { AppSharedModule } from '../../shared.module';
import { AddCustomProductModalModule } from '../add-custom-product-modal/add-custom-product-modal.module';
import { BrowseGlobalMarketModalModule } from '../browse-global-market-modal/browse-global-market-modal.module';

@NgModule({
  declarations: [
    AddMarketProductModalComponent,
  ],
  imports: [
    AppSharedModule,
    ScannerModule,
    AddCustomProductModalModule,
    BrowseGlobalMarketModalModule
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
