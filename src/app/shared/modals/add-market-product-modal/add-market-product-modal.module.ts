import { NgModule } from '@angular/core';

import { AddMarketProductModalComponent } from './add-market-product-modal.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    AddMarketProductModalComponent,
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
  entryComponents: [AddMarketProductModalComponent]
})
export class AddMarketProductModalModule {

}
