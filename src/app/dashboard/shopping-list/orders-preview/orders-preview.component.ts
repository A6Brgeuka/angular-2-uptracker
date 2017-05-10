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
import { OrderService } from '../../../core/services/order.service';


@Component({
  selector: 'app-orders-preview',
  templateUrl: './orders-preview.component.html',
  styleUrls: ['./orders-preview.component.scss']
})
@DestroySubscribers()
export class OrdersPreviewComponent implements OnInit {
  public mockrows = [
    {name:'Some Product Name', location:'Location A', qty:'1', price:100},
    {name:'Some Product', location:'Location A', qty:'3', price:10},
    {name:'Some Name', location:'Location A', qty:'1', price:100},
  ];
  public  orders$:BehaviorSubject<any> = new BehaviorSubject<any>([]);
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public windowLocation: Location,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public orderService: OrderService,
  ) {
  
  }
  
  ngOnInit() {
  //http://localhost:4200/shoppiinglist/purchase/58b3e12962f77d000bcf6495%3Aorders%3Aall%3Abest_price
  //http://localhost:4200/shoppinglist/orders-preview/58b3e12962f77d000bcf6495%3Aorders%3Aall%3Abest_price
    this.route.params
    .switchMap((p:Params)=>{
      return this.orderService.getOrder(p['id']);
    })
    .subscribe((items: any) => {
      let tt = 0;
      _.each(items,(i:any)=>{
        tt+=i.total_nf;
      });
      items.total_total = tt;
      return this.orders$.next(items);
    });
  
  }
  
  goBack(): void {
    this.windowLocation.back();
  }
  
}