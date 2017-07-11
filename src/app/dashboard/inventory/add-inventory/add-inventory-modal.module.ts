import { NgModule } from '@angular/core';

import { AddInventoryModal } from './add-inventory-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    AddInventoryModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  entryComponents: [ AddInventoryModal ]
})
export class AddInventoryModalModule {
}