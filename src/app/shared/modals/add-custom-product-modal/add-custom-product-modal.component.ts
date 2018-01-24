import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Component, OnInit } from '@angular/core';
import { CloseGuard, DialogRef } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';


export class AddCustomProductModalContext extends BSModalContext {
  public text: any;
}

@Component({
  selector: 'app-add-custom-product-modal',
  templateUrl: './add-custom-product-modal.component.html',
  styleUrls: ['./add-custom-product-modal.component.scss']
})

@DestroySubscribers()
export class AddCustomProductModalComponent implements OnInit, CloseGuard {
  
  
  constructor(
    public dialog: DialogRef<AddCustomProductModalContext>,
  ) {
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
  
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
}
