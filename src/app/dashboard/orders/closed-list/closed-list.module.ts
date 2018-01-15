import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ClosedListComponent } from './closed-list.component';

@NgModule({
  declarations: [
    ClosedListComponent,
  ],
  exports: [ClosedListComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class ClosedListModule {

}
