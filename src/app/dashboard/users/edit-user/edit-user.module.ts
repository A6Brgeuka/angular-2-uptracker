import { NgModule } from '@angular/core';

import { EditUserComponent } from './edit-user.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    EditUserComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: [

  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditUserComponent ]
})
export class EditUserModule {
}