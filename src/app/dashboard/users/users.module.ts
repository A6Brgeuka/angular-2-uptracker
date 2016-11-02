import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditUserModalModule } from '../../shared/modals/index';
import { ViewUserModalModule } from './view-user-modal/view-user-modal.module';

@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [
    AppSharedModule,
    EditUserModalModule,
    ViewUserModalModule
  ],
  providers: []
})
export class UsersModule {
}