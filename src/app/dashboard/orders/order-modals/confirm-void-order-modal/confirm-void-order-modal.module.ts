import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { ConfirmVoidOrderModal } from './confirm-void-order-modal.component';

@NgModule({
  declarations: [
    ConfirmVoidOrderModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ConfirmVoidOrderModal ]
})
export class ConfirmVoidOrderModalModule {
}