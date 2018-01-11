import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { MarketplaceTabComponent } from './marketplace-tab.component';

@NgModule({
  declarations: [
    MarketplaceTabComponent,
  ],
  exports: [MarketplaceTabComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class MarketplaceTabModule {

}
