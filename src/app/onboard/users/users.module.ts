import { NgModule } from '@angular/core';

import { OnboardUsersComponent } from './users.component';
import { AppSharedModule } from '../../shared/shared.module';

import { EditUserModal } from '../../shared/modals/index';

@NgModule({
  declarations: [
    OnboardUsersComponent,
    EditUserModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditUserModal ]
})
export class OnboardUsersModule {
}