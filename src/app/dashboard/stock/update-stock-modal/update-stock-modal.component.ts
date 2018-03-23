import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { UserService, AccountService } from '../../../core/services/index';
import { ProductService } from "../../../core/services/product.service";
import { ModalWindowService } from "../../../core/services/modal-window.service";
import * as _ from 'lodash';


export class UpdateStockModalContent extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'update-stock-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './update-stock-modal.component.html',
  styleUrls: ['./update-stock-modal.component.scss']
})
@DestroySubscribers()
export class UpdateStockModal implements OnInit, ModalComponent<UpdateStockModalContent> {
  public subscribers: any = {};
  public context: UpdateStockModalContent;
  public product: any;

  constructor(
    public dialog: DialogRef<UpdateStockModalContent>,
    public userService: UserService,
    public accountService: AccountService,
    public productService: ProductService,
    public modalWindowService: ModalWindowService
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
