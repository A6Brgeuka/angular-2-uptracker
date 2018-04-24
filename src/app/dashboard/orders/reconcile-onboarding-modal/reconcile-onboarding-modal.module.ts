import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ReconcileOnboardingModal } from './reconcile-onboarding-modal.component';
import { SelectDropDownModule } from '../../../shared/components/ngx-select-dropdown/ngx-select-dropdown.module';

@NgModule({
  declarations: [
    ReconcileOnboardingModal
  ],
  imports: [
    AppSharedModule,
    SelectDropDownModule,
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ReconcileOnboardingModal ]
})
export class ReconcileOnboardingModalModule {}
