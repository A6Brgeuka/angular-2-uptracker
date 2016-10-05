import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
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
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ UserModal ]
})
export class UsersModule {
}