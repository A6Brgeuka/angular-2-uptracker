import { NgModule } from '@angular/core';

import { OnboardUsersComponent } from './users.component';
import { USERS_RESOLVER_PROVIDERS } from './users-resolve.service';
import { AppSharedModule } from '../../shared/shared.module';

import { UserModal } from './user-modal/user-modal.component';

@NgModule({
  declarations: [
    OnboardUsersComponent,
    UserModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [
    ...USERS_RESOLVER_PROVIDERS
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ UserModal ]
})
export class OnboardUsersModule {
}