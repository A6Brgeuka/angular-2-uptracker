import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { MarketplaceTabComponent } from './marketplace-tab.component';
import {AddMarketProductModalModule} from './add-market-product-modal/add-market-product-modal.module';

@NgModule({
  declarations: [
    MarketplaceTabComponent,
  ],
  exports: [MarketplaceTabComponent],
  imports: [
    AppSharedModule,
    AddMarketProductModalModule,
  ],
  providers: [],
})
export class MarketplaceTabModule {

}
