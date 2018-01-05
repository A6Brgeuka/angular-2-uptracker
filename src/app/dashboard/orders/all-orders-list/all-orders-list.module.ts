import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { AllOrdersListComponent } from './all-orders-list.component';

@NgModule({
  declarations: [
    AllOrdersListComponent,
  ],
  exports: [AllOrdersListComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class AllOrdersListModule {

}
