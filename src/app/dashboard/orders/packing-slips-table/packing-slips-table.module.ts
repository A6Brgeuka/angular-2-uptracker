import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { PackingSlipsTableComponent } from './packing-slips-table.component';
import { PACKINGSLIPS_PROVIDERS } from './services/index';
import { AllPackingSlipsListModule } from './all-packing-slips-list/all-packing-slips-list.module';
import { OpenPackingSlipsListModule } from './open-packing-slips-list/open-packing-slips-list.module';

@NgModule({
  declarations: [
    PackingSlipsTableComponent,
  ],
  imports: [
    AppSharedModule,
    AllPackingSlipsListModule,
    OpenPackingSlipsListModule,
  ],
  providers: [
    PACKINGSLIPS_PROVIDERS,
  ]
})
export class PackingSlipsTableModule {
}
