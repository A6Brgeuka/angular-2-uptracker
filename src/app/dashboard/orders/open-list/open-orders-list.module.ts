import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OpenOrdersListComponent } from './open-orders-list.component';

@NgModule({
  declarations: [
    OpenOrdersListComponent,
  ],
  exports: [OpenOrdersListComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class OpenOrdersListModule {

}
