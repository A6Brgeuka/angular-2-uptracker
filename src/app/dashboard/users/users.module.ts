import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { AppSharedModule } from '../../shared/shared.module';
import { EditUserModalModule } from '../../shared/modals/index';

@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [
    AppSharedModule,
    EditUserModalModule
  ],
  providers: []
})
export class UsersModule {
}