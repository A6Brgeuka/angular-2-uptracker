import { NgModule } from '@angular/core';

import { AddToOrderModal } from './add-to-order-modal.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    AddToOrderModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  entryComponents: [ AddToOrderModal ]
})
export class AddToOrderModalModule {
}