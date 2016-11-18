import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { AppSharedModule } from '../../shared/shared.module';

// import { EditUserModalModule } from '../../shared/modals/index';
import { ViewUserModalModule } from './view-user-modal/view-user-modal.module';
// import { EditUserModal } from '../../shared/modals/edit-user-modal/edit-user-modal.component';

@NgModule({
  declarations: [
    UsersComponent,
    // EditUserModal
  ],
  imports: [
    AppSharedModule,
    // EditUserModalModule,
    ViewUserModalModule
  ],
  providers: [],
  // entryComponents: [ EditUserModal ]
})
export class UsersModule {
}