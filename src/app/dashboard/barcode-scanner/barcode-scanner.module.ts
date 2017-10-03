import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../shared/shared.module';
import { BarcodeScannerModal } from './barcode-scanner.component';

@NgModule({
  declarations: [
    BarcodeScannerModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ BarcodeScannerModal ]
})
export class BarcodeScannerModule {
}