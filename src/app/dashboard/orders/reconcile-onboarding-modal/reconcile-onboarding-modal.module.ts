import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ReconcileOnboardingModal } from './reconcile-onboarding-modal.component';

@NgModule({
  declarations: [
    ReconcileOnboardingModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ReconcileOnboardingModal ]
})
export class ReconcileOnboardingModalModule {}
