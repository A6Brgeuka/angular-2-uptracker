import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared.module';
//import { BarcodeScannerModal } from './barcode-scanner-modal.component';

@NgModule({
  declarations: [
    //BarcodeScannerModal
  ],
  imports: [
    AppSharedModule,
  ],
  providers: [],
  exports: [
    //BarcodeScannerModal
  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  //entryComponents: [BarcodeScannerModal]
})
export class BarcodeScannerModalModule {
}