import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';
import { AccountService } from '../../../core/services/account.service';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { Router } from "@angular/router";


//export class ViewProductModalContext extends BSModalContext {
  //public items: any;
//}


@Component({
  selector: 'app-order-detail',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './orders-short-detail.component.html',
  styleUrls: ['./orders-short-detail.component.scss']
})
@DestroySubscribers()
export class OrdersShortDetailComponent implements OnInit, AfterViewInit {
  public subscribers: any = {};
  public locationArr: any;
  
  @Input("item") public item: any = [];
  @Input("visible") public visible;

  constructor(
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public accountService: AccountService,
    public router: Router,
    public pastOrderService: PastOrderService,

  ) {
    this.accountService.locations$
    .subscribe(r=>{this.locationArr = r});
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  toggleVariantVisibility(variant) {
    variant.status = variant.status == 2 ? variant.status =1 : variant.status = 2;
  }

  variantDetailCollapse() {
    //this.variant.detailView = false;
  }
  
  getReceiveProduct(item) {
    this.subscribers.receiveOrders = this.pastOrderService.getReceiveProduct(item.id)
    .subscribe();
  }
 
}
