import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared.module';
import {BrowseGlobalMarketModalComponent} from "./browse-global-market-modal.component";

@NgModule({
  declarations: [
    BrowseGlobalMarketModalComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  exports: [
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [BrowseGlobalMarketModalComponent]
})
export class BrowseGlobalMarketModalModule {

}
