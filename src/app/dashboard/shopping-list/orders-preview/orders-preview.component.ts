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
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrderOptions, OrderService } from '../../../core/services/order.service';
import { ToasterService } from '../../../core/services/toaster.service';


@Component({
  selector: 'app-orders-preview',
  templateUrl: './orders-preview.component.html',
  styleUrls: ['./orders-preview.component.scss']
})
@DestroySubscribers()
export class OrdersPreviewComponent implements OnInit {
  
  public orderId: string = '';
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public windowLocation: Location,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public orderService: OrderService,
    public toasterService: ToasterService,
    public router:Router,
  ) {
  
  }
  
  ngOnInit() {
    this.route.params
    .switchMap((p: Params) => {
      this.orderId = p['id'];
      return this.orderService.getOrder(p['id']);
    })
    .subscribe((items: any) => {
      return this.calcTT(items);
    });
    
  }
  
  calcTT(items) {
    let tt = 0;
    _.each(items, (i: any) => {
      tt += i.total_nf;
    });
    items.total_total = tt;
    return this.orders$.next(items);
  }
  
  saveOrder(orderId: string, key: string, val, vendorId: string) {
    if (key != "ship_to" && key != "order_method") {
      const regex = /[\d\.]*/g;
      regex.lastIndex++;
      let m: any = regex.exec(val);
      val = m ? parseFloat(m[0]) : 0;
    }
    let data: any = {};
    data[key] = val;
    data['vendor_id'] = vendorId;
    this.orderService.updateOrder(orderId, data).subscribe((res: any) => {
        this.toasterService.pop('', 'Data updated');
        this.calcTT(res);
      },
      (res: any) => {
        this.toasterService.pop('error', res.statusText);
        console.error(res);
      })
  }
  
  
  goBack(): void {
    this.windowLocation.back();
  }
  
  prefillDataForConvertion(order: any) {
    if (order[0].ship_to.location_id) {
      this.orderService.convertData = {
        vendor_id: [order[0].vendor_id],
        location_id: order[0].ship_to.location_id
      };
      this.route.params.subscribe((p:Params)=>{
        this.router.navigate(['/shoppinglist','purchase',p['id']]);
      });
    }
  }
}