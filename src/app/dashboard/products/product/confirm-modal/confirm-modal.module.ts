import { NgModule } from '@angular/core';

import { ConfirmModal } from './confirm-modal.component';
import { AppSharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    ConfirmModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ConfirmModal ]
})
export class ConfirmModalModule {
}