import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';
import { AccountService } from '../../../core/services/account.service';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-order-detail',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './orders-short-detail.component.html',
  styleUrls: ['./orders-short-detail.component.scss']
})
@DestroySubscribers()
export class OrdersShortDetailComponent {
  public subscribers: any = {};
  public locationArr: any;
  
  @Input("item") public item: any = [];
  @Input("visible") public visible;
  @Output() public isAllCheckedChanged = new EventEmitter();

  constructor(
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public accountService: AccountService,
    public router: Router,
    public pastOrderService: PastOrderService,
  ) {

  }

  toggleVariantVisibility(variant) {
    variant.status = variant.status == 2 ? variant.status =1 : variant.status = 2;
  }

  variantDetailCollapse() {
    //this.variant.detailView = false;
  }
  
  getReceiveProduct(item, product) {
    let queryParams = item.order_id.toString() + '&' + product.id.toString();
    this.pastOrderService.goToReceive(queryParams);
  }
  
  onReceiveCheckedProducts() {
    let filteredCheckedProducts:any[]  = _.filter(this.item.order_items, 'checked');
    let sendItems: any[] = [];
    sendItems = sendItems.concat(filteredCheckedProducts.map((product) => product.id));
    let queryParams = this.item.order_id.toString() + '&' + sendItems.toString();
    this.pastOrderService.goToReceive(queryParams);
  }
  
  setCheckbox(event) {
    const filteredCheckedProducts:any[]  = _.filter(this.item.order_items, 'checked');
    this.item.checked = filteredCheckedProducts.length === this.item.order_items.length;
    this.isAllCheckedChanged.emit(this.item.checked);
  }
  
}
