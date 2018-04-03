import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { PackingSlipsTableComponent } from './packing-slips-table.component';

@NgModule({
  declarations: [
    PackingSlipsTableComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: [
    // ORDER_PROVIDERS
  ]
})
export class PackingSlipsTableModule {
}
