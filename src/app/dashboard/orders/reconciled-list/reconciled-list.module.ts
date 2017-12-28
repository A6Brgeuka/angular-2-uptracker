import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ReconciledListComponent } from './reconciled-list.component';

@NgModule({
  declarations: [
    ReconciledListComponent,
  ],
  exports: [ReconciledListComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class ReconciledListModule {

}