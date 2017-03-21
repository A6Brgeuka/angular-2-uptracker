import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

export class AddToOrderModalContext extends BSModalContext {
  public data: any;
}

@Component({
  selector: 'app-add-to-order-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  templateUrl: './add-to-order-modal.component.html',
  styleUrls: ['./add-to-order-modal.component.scss']
})

@DestroySubscribers()
export class AddToOrderModal implements OnInit, CloseGuard, ModalComponent<AddToOrderModalContext> {
  context: AddToOrderModalContext;
  private quantity:number=0;
  private vendor:string=null;
  private location:string=null;
  
  
  constructor(
      public dialog: DialogRef<AddToOrderModalContext>,
  ) {
  
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
}
