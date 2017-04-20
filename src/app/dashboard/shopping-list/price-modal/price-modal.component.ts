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

export class Discounts {
  type:string;
  amount:number;
  discounted:number;
  reward:0;
  total:number;
  typeBogo:string;
  constructor(){
    this.type = 'fixed';
    this.discounted = 0;
    this.amount = 5;
    this.reward = 0;
    this.total = 5;
    this.typeBogo = 'free';
  }
}

@Component({
  selector: 'app-price-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  templateUrl: './price-modal.component.html',
  styleUrls: ['./price-modal.component.scss']
})
@DestroySubscribers()
export class PriceModal implements OnInit, CloseGuard, ModalComponent<PriceModalContext> {
  public subscribers: any = {};
  context: PriceModalContext;
  public filter:any = {'department':'', 'vendor':'', 'onlymy':false};
  public discounts = [];
  public selectedVendor = {};
  public selectedPrice:number = 0;
  public totalPrice:number = 0;
  
  constructor(
      public dialog: DialogRef<PriceModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  
  }

  ngOnInit(){
    console.log(this.context);
    this.selectedVendor = this.context.product.vendors.find(
      (v) => {
        
        return (v.vendor_variant_id == this.context.product.selected_vendor.vendor_variant_id);
      });
    
  
  }
  
  setPrice(price){
    this.selectedPrice = price;
    this.calcDiscount();
  }
  
  calcDiscount(){
    this.totalPrice = this.selectedPrice;
    _.each(this.discounts, (dis:Discounts)=>{
      if (dis.type == 'fixed') {
        dis.total = dis.amount;
      } else if (dis.type == 'percentage')  {
        dis.total = dis.amount*this.selectedPrice/100;
      }
      this.totalPrice = this.totalPrice - dis.total;
    });
    
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
  
  addDiscount(){
    this.discounts.push(new Discounts());
    this.calcDiscount();
  }
  
  removeDiscount(){
    let a = this.discounts.splice(this.discounts.length-1);
  }
}
