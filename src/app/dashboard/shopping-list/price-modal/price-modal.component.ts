import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { UserService, AccountService } from '../../../core/services/index';
import { CartService, PriceInfoData, PriceInfoDiscounts } from '../../../core/services/cart.service';

export class PriceModalContext extends BSModalContext {
  public product: any;
}

export class Discounts {
  type: string;
  amount: number;
  discounted: number;
  reward: 0;
  total: number;
  typeBogo: string;
  
  constructor() {
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
  templateUrl: './price-modal.component.html',
  styleUrls: ['./price-modal.component.scss']
})
@DestroySubscribers()
export class PriceModal implements OnInit, CloseGuard, ModalComponent<PriceModalContext> {
  public subscribers: any = {};
  context: PriceModalContext;
  public filter: any = {'department': '', 'vendor': '', 'onlymy': false};
  public discounts = [];
  public selectedVendor: any = {};
  public selectedPrice: number = 0;
  public totalPrice: number = 0;
  public selectedPriceType: string;
  
  constructor(
    public dialog: DialogRef<PriceModalContext>,
    public userService: UserService,
    public accountService: AccountService,
    public cartService: CartService,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    this.selectedVendor = this.context.product.vendors.find(
      (v) => {
        return (v.vendor_variant_id == this.context.product.selected_vendor.vendor_variant_id);
      });
    if (this.context.product.price) {
      this.selectedPrice = this.context.product.price;
    } else {
      let prices:number[] =
        [this.selectedVendor.book_price,this.selectedVendor.your_price,this.selectedVendor.club_price]
        .filter((p:number)=>p);
        this.selectedPrice = Math.min(...prices);
    }
      switch (this.selectedPrice) {
        case this.selectedVendor.book_price:
          this.selectedPriceType = "book";
          break;
        case this.selectedVendor.your_price:
          this.selectedPriceType = "your";
          break;
        case this.selectedVendor.club_price:
          this.selectedPriceType = "club";
          break;
      }
    this.calcDiscount();
  
  }
  
  setPrice(price, type) {
    this.selectedPrice = price;
    this.selectedPriceType = type;
    
    this.calcDiscount();
  }
  
  calcDiscount() {
    this.totalPrice = this.selectedPrice;
    _.each(this.discounts, (dis: Discounts) => {
      if (dis.type == 'fixed') {
        dis.total = dis.amount;
      } else if (dis.type == 'percentage') {
        dis.total = dis.amount * this.selectedPrice / 100;
      }
      this.totalPrice = this.totalPrice - dis.total;
    });
    
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
  addDiscount() {
    this.discounts.push(new Discounts());
    this.calcDiscount();
  }
  
  removeDiscount() {
    let a = this.discounts.splice(this.discounts.length - 1);
  }
  
  savePriceInfo() {
    let data:PriceInfoData = {
      price_type:this.selectedPriceType,
      price:this.selectedPrice,
      variant_id:this.context.product.variant_id,
      discounts:[]

    };
    data.discounts =_.map(this.discounts,(d:any)=>{
      let b = {
        type:d.type,
        amount:d.amount,
        reward_points:d.reward,
        bogo_type:d.typeBogo,
        discounted:d.discounted
      };
      let c = new PriceInfoDiscounts(b);
      return b;
    });
   console.log(data);
    this.cartService.updatePriceInfo(data,this.context.product.location_id)
    .subscribe(
      (r:any) => {
        this.cartService.updateCollection(r.data.items);
        this.dismissModal();
      },
      (er:any) => {
       debugger;
      }
    );
  }
}
