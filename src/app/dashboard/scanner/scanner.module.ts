import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Angular2FontawesomeModule } from 'angular2-fontawesome';

import { ScannerComponent } from './scanner.component';
import { BarcodeScannerModule } from './barcode-scanner/barcode-scanner.module';
import { QrScannerModule } from './qr-scanner/qr-scanner.module';
import { VideoModule } from './video-modal/video-modal.module';
import { BarcodeScannerService } from './barcode-scanner.service';

@NgModule({
  declarations: [
    ScannerComponent,
  ],
  exports: [
    ScannerComponent
  ],
  imports: [
    CommonModule,
    Angular2FontawesomeModule,
    BarcodeScannerModule,
    QrScannerModule,
    VideoModule
  ],
  providers: [
    BarcodeScannerService,
  ],
})
export class ScannerModule {
}
