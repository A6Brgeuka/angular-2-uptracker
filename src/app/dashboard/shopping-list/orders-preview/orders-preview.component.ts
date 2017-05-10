import {
  Component, OnInit, ViewContainerRef, ReflectiveInjector, ComponentRef, Injector,
  Injectable, Renderer
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { Location }                 from '@angular/common';

import {
  Overlay, overlayConfigFactory, DialogRef, createComponent, ModalOverlay,
  OverlayRenderer, DOMOverlayRenderer
} from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ModalWindowService } from "../../../core/services/modal-window.service";
import { UserService } from '../../../core/services/user.service';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Params } from '@angular/router';
import { OrderOptions, OrderService } from '../../../core/services/order.service';
import { ToasterService } from '../../../core/services/toaster.service';


@Component({
  selector: 'app-orders-preview',
  templateUrl: './orders-preview.component.html',
  styleUrls: ['./orders-preview.component.scss']
})
@DestroySubscribers()
export class OrdersPreviewComponent implements OnInit {
  
  public orderId:string='';
  public  orders$:BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public windowLocation: Location,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public orderService: OrderService,
    public toasterService:ToasterService
  ) {
  
  }
  
  ngOnInit() {
  //http://localhost:4200/shoppiinglist/purchase/58b3e12962f77d000bcf6495%3Aorders%3Aall%3Abest_price
  //http://localhost:4200/shoppinglist/orders-preview/58b3e12962f77d000bcf6495%3Aorders%3Aall%3Abest_price
    this.route.params
    .switchMap((p:Params)=>{
      this.orderId = p['id'];
      return this.orderService.getOrder(p['id']);
    })
    .subscribe((items: any) => {
      return this.calcTT(items);
    });
  
  }
  
  calcTT(items){
    let tt = 0;
    _.each(items,(i:any)=>{
      tt+=i.total_nf;
    });
    items.total_total = tt;
    return this.orders$.next(items);
  }
  
  saveOrder(orderId:string,key:string,val:string, vendorId:string){
    let data:any = {};
    data[key]=val;
    data['vendor_id'] = vendorId;
    this.orderService.updateOrder(orderId,data).subscribe((res:any)=>{
        this.toasterService.pop('',res.statusText);
        this.calcTT(res);
        console.log('Data updated');
      },
      (res:any)=>{
        this.toasterService.pop('error',res.statusText);
        console.error(res);
      })
  }
  
  
  goBack(): void {
    this.windowLocation.back();
  }
  
}