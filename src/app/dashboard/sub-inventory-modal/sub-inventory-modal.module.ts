import { NgModule } from '@angular/core';

import { SubInventoryModal } from './sub-inventory-modal.component';
import { AppSharedModule } from '../../shared/shared.module';
import { RangeSliderModule } from '../../shared/components/range-slider/range-slider.module';

@NgModule({
  declarations: [
    SubInventoryModal
  ],
  imports: [
    AppSharedModule,
    RangeSliderModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ SubInventoryModal ]
})
export class SubInventoryModalModule {
}
