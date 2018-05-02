import { NgModule } from '@angular/core';
import { ScannerComponent } from './scanner.component';
import { BarcodeScannerModule } from './barcode-scanner/barcode-scanner.module';
import { QrScannerModule } from './qr-scanner/qr-scanner.module';
import { AppSharedModule } from '../../shared/shared.module';
import {VideoModule} from './video-modal/video-modal.module';
import {CommonModule} from "@angular/common";
import {Angular2FontawesomeModule} from "angular2-fontawesome";

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
  providers: [],
})
export class ScannerModule {
}
