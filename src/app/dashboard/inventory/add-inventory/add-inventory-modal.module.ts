import { NgModule } from '@angular/core';

import { AddInventoryModal } from './add-inventory-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { ScannerModule } from '../../scanner/scanner.module';

@NgModule({
  declarations: [
    AddInventoryModal,
  ],
  imports: [
    AppSharedModule,
    ScannerModule
  ],
  providers: [],
  entryComponents: [ AddInventoryModal ]
})
export class AddInventoryModalModule {
}