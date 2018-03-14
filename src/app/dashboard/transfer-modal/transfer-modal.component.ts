import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import { VendorModel } from '../../models';
import { UserService, AccountService } from '../../core/services';
import * as _ from 'lodash';


export class TransferModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'transfer-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss']
})
@DestroySubscribers()
export class TransferModal implements OnInit, ModalComponent<TransferModalContext> {
  public subscribers: any = {};
  context: TransferModalContext;

  constructor(
      public dialog: DialogRef<TransferModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {}

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
