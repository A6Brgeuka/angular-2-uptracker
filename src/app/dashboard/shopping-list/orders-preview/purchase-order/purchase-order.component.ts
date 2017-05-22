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

import { ModalWindowService } from "../../../../core/services/modal-window.service";
import { UserService } from '../../../../core/services/user.service';
import { AccountService } from '../../../../core/services/account.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConvertedOrder, OrderService } from '../../../../core/services/order.service';



@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
@DestroySubscribers()
export class PurchaseOrderComponent implements OnInit {
  public mockrows = [
    {name:'Some Product Name', location:'Location A', qty:'1', price:100},
    {name:'Some Product', location:'Location A', qty:'3', price:10},
    {name:'Some Name', location:'Location A', qty:'1', price:100},
  ];
  public  orders$:BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public orderId: string;
  convertedOrder: BehaviorSubject<ConvertedOrder> = new BehaviorSubject(new ConvertedOrder());
  
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public windowLocation: Location,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public orderService: OrderService,
    public router: Router,
  ) {
  
  }
  
  ngOnInit() {
  
    this.route.params
    .switchMap((p:Params)=>{
      this.orderId = p['id'];
      return this.orderService.getOrder(p['id']);
    })
    .subscribe((items: any) => {
      let tt = 0;
      _.each(items,(i:any)=>{
        tt+=i.total_nf;
      });
      items.total_total = tt;
      if (this.orderService.convertData) {
        this.orderService.convertOrders(
          this.orderId,
          this.orderService.convertData
        )
        .map((data:any)=>{
          return data.data;
        })
        .subscribe((data:ConvertedOrder)=>{
          console.log(data);
          this.convertedOrder.next(data);
        });
      } else {
        if (this.orderId){
          this.router.navigate(['/shoppinglist','orders-preview',this.orderId]);
       } else {
          this.router.navigate(['/shoppinglist']);
       }
  
      }
      return this.orders$.next(items);
    });
  
  }
  
  goBack(): void {
    this.windowLocation.back();
  }
  
  
}