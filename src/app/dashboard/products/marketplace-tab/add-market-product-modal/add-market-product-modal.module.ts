import { NgModule } from '@angular/core';

import { AddMarketProductModalComponent } from './add-market-product-modal.component';
import {NguiAutoCompleteModule} from "@ngui/auto-complete";
import {ScannerModule} from "../../../scanner/scanner.module";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    AddMarketProductModalComponent,
  ],
  imports: [
    RouterModule,
    NguiAutoCompleteModule,
    ScannerModule
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
