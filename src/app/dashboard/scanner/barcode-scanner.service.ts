import { Injectable } from '@angular/core';

import { ToasterService } from '../../core/services/toaster.service';

@Injectable()
export class BarcodeScannerService {
  window: any;

  constructor(
    private toasterService: ToasterService,
  ) {
    this.window = window;
  }
  /** TODO
     We need to call the javascript method `window.scanBarcode()` whenever someone clicks or touches the scan button.
     This method needs to display a message saying the following. "Scanning functionality only available through our mobile app."
     I will overwrite this method when the website is loaded in the native app. (03.05.2018 task #312)
   **/

  scanBarcode() {
    if (this.window.scanBarcode) {
      this.window.scanBarcode();
    } else {
      this.toasterService.pop('error', `Scanning functionality only available through our mobile app.`);
    }
  }
}

