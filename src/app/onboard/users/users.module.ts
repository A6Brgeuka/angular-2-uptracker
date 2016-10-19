import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { USERS_RESOLVER_PROVIDERS } from './users-resolve.service';
import { AppSharedModule } from '../../shared/shared.module';

import { UserModal } from './user-modal/user-modal.component';

@NgModule({
  declarations: [
    UsersComponent,
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
export class UsersModule {
}