import { NgModule } from '@angular/core';

import { BrowseGlobalMarketComponent } from './browse-global-market.component';
import {AppSharedModule} from '../../../shared/shared.module';
import {SearchFilterHeaderModule} from '../../../shared/components/search-filter-header/search-filter-header.module';

@NgModule({
  declarations: [
    BrowseGlobalMarketComponent,
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
  entryComponents: [BrowseGlobalMarketComponent]
})
export class BrowseGlobalMarketModule {

}
