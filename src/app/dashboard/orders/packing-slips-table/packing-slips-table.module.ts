import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { PackingSlipsTableComponent } from './packing-slips-table.component';
import { PACKINGSLIPS_PROVIDERS } from './services/index';

@NgModule({
  declarations: [
    PackingSlipsTableComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: [
    PACKINGSLIPS_PROVIDERS,
  ]
})
export class PackingSlipsTableModule {
}
