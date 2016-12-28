import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { ProductModel } from '../../../models/index';
import { UserService, AccountService } from '../../../core/services/index';
import { ProductService } from "../../../core/services/product.service";

export class ViewProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-view-product-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './view-product-modal.component.html',
  styleUrls: ['./view-product-modal.component.scss']
})
@DestroySubscribers()
export class ViewProductModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<ViewProductModalContext> {
  private subscribers: any = {};
  context: ViewProductModalContext;
  private product: any;
  public variation: any = {
    pkg: ''
  };
  public comment: any = {};

  // @ViewChild('secondary') secondaryLocationLink: ElementRef;

  constructor(
      public dialog: DialogRef<ViewProductModalContext>,
      public userService: UserService,
      public accountService: AccountService,
      public productService: ProductService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    this.product = this.context.product;
    this.product.hazardous_string = this.product.hazardous ? 'Yes' : 'No';
    this.product.trackable_string = this.product.trackable ? 'Yes' : 'No';
    this.product.tax_exempt_string = this.product.tax_exempt ? 'Yes' : 'No';
    this.product.comments = [];
    this.subscribers.getProductCommentsSubscription = this.productService.getProductComments(this.context.product.id)
      .filter(res=>res.data)
      .subscribe(res => {
        this.product.comments = res.data.comments || [];
        this.product.comments.map(item => {
          item.body = item.body.replace(/(?:\r\n|\r|\n)/g, "<br />");
          return item;
        })
    });
  }

  ngAfterViewInit(){
    // this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
    //   this.chooseTabLocation(res);
    //   if (res && res.id != this.primaryLocation.id){
    //     this.secondaryLocationLink.nativeElement.click();
    //   }
    // });
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  changePkg(event){
    this.variation.pkg = event.target.value;
  }

  changeUnit(event){
    this.variation.unit = event.target.value;
  }

  changeUnitsPkg(event){
    this.variation.unit_pkg = event.target.value;
  }

  sendComment() {
    this.comment;
    Object.assign(this.comment,
      {
        "user_id": this.userService.selfData.id,
        "object_type": "products",
        "object_id": this.product.id
      }
      );
    this.productService.addProductComment(this.comment).subscribe(res => {
      this.comment.body = null;
      this.product.comments.push(res.data)
    });
  }

  // editVendor(vendor = null){
  //   if (this.currentLocation) {
  //     this.accountService.dashboardLocation$.next(this.currentLocation);
  //   }
  //   this.closeModal(vendor);
  // }

  // chooseTabLocation(location = null){
  //   if (location && location != this.primaryLocation) {
  //     this.sateliteLocationActive = true;
  //     this.secondaryLocation = location;
  //   } else {
  //     this.sateliteLocationActive = false;
  //   }
  //   this.currentLocation = location;
  //
  //   // fill vendor info for modal view vendor
  //   this.vendor = new VendorModel(this.context.vendor);
  //   if (location){
  //     let locationAccountVendor = _.find(this.accountVendors, {'location_id': this.currentLocation.id});
  //     _.each(locationAccountVendor, (value, key) => {
  //       if (value)
  //           this.vendor[key] = value;
  //     });
  //   }
  // }
}
