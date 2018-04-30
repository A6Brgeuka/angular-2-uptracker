import { NgModule } from '@angular/core';

import { AddInventoryModal } from './add-inventory-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { HelpTextModalModule } from './help-text-modal/help-text-modal.module';
import { AddCustomProductModule } from '../../../shared/components/add-custom-product.module';

@NgModule({
  declarations: [
    AddInventoryModal,
  ],
  imports: [
    AppSharedModule,
    HelpTextModalModule,
    AddCustomProductModule,
  ],
  providers: [],
  entryComponents: [ AddInventoryModal ]
})
export class AddInventoryModalModule {
}
