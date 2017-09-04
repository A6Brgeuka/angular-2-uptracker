import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class BarcodeScannerModalContext extends BSModalContext {
  public text: any;
}


@Component({
  selector: 'barcode-scanner-modal',
  templateUrl: './barcode-scanner-modal.component.html',
  styleUrls: ['./barcode-scanner-modal.component.scss']
})
export class BarcodeScannerModal implements OnInit, CloseGuard, ModalComponent<BarcodeScannerModalContext> {
  context;
  constructor(
    public dialog: DialogRef<BarcodeScannerModalContext>,
  ) {
    this.context = dialog.context.text;
    dialog.setCloseGuard(this);
  }
  ngOnInit() {
  
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
}