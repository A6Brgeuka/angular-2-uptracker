import { NgModule } from '@angular/core';
import { BarcodeScannerComponent } from './barcode-scanner.component';
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    BarcodeScannerComponent
  ],
  exports: [
    BarcodeScannerComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [],
})
export class BarcodeScannerModule {
}
