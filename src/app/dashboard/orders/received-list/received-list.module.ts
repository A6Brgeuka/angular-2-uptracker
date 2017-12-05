import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ReceivedListComponent } from './received-list.component';

@NgModule({
  declarations: [
    ReceivedListComponent,
  ],
  exports: [ReceivedListComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class ReceivedListModule {

}