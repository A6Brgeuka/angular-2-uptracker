import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { AddToOrderModal } from '../../../../shared/modals/add-to-order-modal/add-to-order-modal.component';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';
import { AccountService } from '../../../../core/services/account.service';


export class ViewProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-variant-detail',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './variant-short-detail.component.html',
  styleUrls: ['./variant-short-detail.component.scss']
})
@DestroySubscribers()
export class VariantShortDetailComponent implements OnInit, AfterViewInit {
  private locationArr: any;
  
  @Input("variant") private variant;
  @Input("product_id") private product_id;
  @Input("showEdit") private showEdit;

  constructor(
    public modalWindowService: ModalWindowService,
    private modal: Modal,
    public accountService: AccountService,

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
    this.variant.detailView = false;
  }
  //
  //addToOrder(selected) {
  //
  //  let modalData = {
  //    'quantity':1,
  //    'vendorArr':this.variant.vendor_variants,
  //    'locationArr':this.locationArr,
  //    'productId':this.product_id,
  //    'selectedVariant':selected
  //  };
  //  this.modal
  //  .open(AddToOrderModal, this.modalWindowService.overlayConfigFactoryWithParams({data:modalData}, true))
  //  .then((resultPromise) => {
  //      resultPromise.result.then(
  //        (resp) => {
  //          //todo smth
  //        },
  //        (err) => {
  //        });
  //    },
  //    (err) => {
  //    });
  //}
  //
}
