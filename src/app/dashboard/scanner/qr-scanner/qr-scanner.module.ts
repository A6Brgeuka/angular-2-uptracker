import { NgModule } from '@angular/core';
import { QrScannerComponent } from './qr-scanner.component';
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    QrScannerComponent
  ],
  exports: [
    QrScannerComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [],
})
export class QrScannerModule {
}
