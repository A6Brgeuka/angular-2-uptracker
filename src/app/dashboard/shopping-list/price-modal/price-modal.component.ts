import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { UserService, AccountService } from '../../../core/services/index';

export class PriceModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-price-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  templateUrl: './price-modal.component.html',
  styleUrls: ['./price-modal.component.scss']
})
@DestroySubscribers()
export class PriceModal implements OnInit, CloseGuard, ModalComponent<PriceModalContext> {
  private subscribers: any = {};
  context: PriceModalContext;
  private filter:any = {'department':'', 'vendor':'', 'onlymy':false};


  constructor(
      public dialog: DialogRef<PriceModalContext>,
      public userService: UserService,
      public accountService: AccountService
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
