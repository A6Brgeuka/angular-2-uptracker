import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ReceivedListComponent } from './received-list.component';
import { ReceivedListShortDetailComponent } from './received-list-short-detail/received-list-short-detail.component';

@NgModule({
  declarations: [
    ReceivedListComponent,
    ReceivedListShortDetailComponent
  ],
  exports: [ReceivedListComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class ReceivedListModule {

}