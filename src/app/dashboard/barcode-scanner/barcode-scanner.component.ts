import { Component, OnInit } from '@angular/core';

import Quagga from 'quagga';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class BarcodeScannerModalContext extends BSModalContext {
  public data: any;
}


@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerModal implements OnInit, CloseGuard, ModalComponent<BarcodeScannerModalContext> {
  context;
  CameraIsAvailable: boolean = false;
  quaggaConfig: any;
  barcodeRes: string = '';
  codeImg: string = '';
  
  constructor(
    public dialog: DialogRef<BarcodeScannerModalContext>,
  ) {
    this.context = dialog.context.data;
    dialog.setCloseGuard(this);
  
    this.quaggaConfig = {
      inputStream: {
        size: 320
      },
      locator: {
        patchSize: "x-large",
        halfSample: false
      },
      numOfWorkers: 1,
      decoder: {
        readers: ['upc_reader']
      },
      locate: true,
      src: null
    };
    
    
  }
  ngOnInit() {
    
  }
  
  onChangeFile(file) {
    const barcodeImg = URL.createObjectURL(file.target.files[0]);
    this.codeImg = barcodeImg;
    this.onDecodeSingle(barcodeImg);
  }
  
  rerun() {
    this.onDecodeSingle(this.codeImg);
  }
  
  onDecodeSingle(src) {
    this.quaggaConfig.src = src;
    Quagga.decodeSingle(this.quaggaConfig, result => {
      if (result.codeResult) {
        this.barcodeRes = result.codeResult.code;
        console.log("result", result.codeResult.code);
      } else {
        console.log("not detected");
      }
    
    });
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
}