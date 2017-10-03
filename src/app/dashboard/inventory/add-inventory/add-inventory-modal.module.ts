import { NgModule } from '@angular/core';

import { AddInventoryModal } from './add-inventory-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { BarcodeScannerModule } from '../../barcode-scanner/barcode-scanner.module';

@NgModule({
  declarations: [
    AddInventoryModal
  ],
  imports: [
    AppSharedModule,
    BarcodeScannerModule
  ],
  providers: [],
  entryComponents: [ AddInventoryModal ]
})
export class AddInventoryModalModule {
}