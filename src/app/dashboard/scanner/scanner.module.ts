import { NgModule } from '@angular/core';
import { ScannerComponent } from './scanner.component';
import { BarcodeScannerModule } from './barcode-scanner/barcode-scanner.module';
import { QrScannerModule } from './qr-scanner/qr-scanner.module';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ScannerComponent,
  ],
  exports: [
    ScannerComponent
  ],
  imports: [
    AppSharedModule,
  
    BarcodeScannerModule,
    QrScannerModule
  ],
  providers: [],
})
export class ScannerModule {
}