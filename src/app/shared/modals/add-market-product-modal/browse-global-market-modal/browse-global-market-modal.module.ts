import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared.module';
import { BrowseGlobalMarketModalComponent } from './browse-global-market-modal.component';
import { SearchFilterHeaderModule } from '../../../components/search-filter-header/search-filter-header.module';

@NgModule({
  declarations: [
    BrowseGlobalMarketModalComponent,
  ],
  imports: [
    AppSharedModule,
    SearchFilterHeaderModule
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
