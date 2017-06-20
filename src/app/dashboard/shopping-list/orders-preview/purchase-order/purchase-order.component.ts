import {
  Component, OnInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Location }                 from '@angular/common';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ModalWindowService } from "../../../../core/services/modal-window.service";
import { UserService } from '../../../../core/services/user.service';
import { AccountService } from '../../../../core/services/account.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConvertedOrder, OrderService } from '../../../../core/services/order.service';
import { ToasterService } from '../../../../core/services/toaster.service';
import { EditEmailDataModal } from './edit-email-data-modal/edit-email-data-modal.component';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
@DestroySubscribers()
export class PurchaseOrderComponent implements OnInit {
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
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
    public toasterService: ToasterService,
  ) {
  
  }
  
  ngOnInit() {
  
    this.route.params
    .switchMap((p: Params) => {
      this.orderId = p['id'];
      return this.orderService.getOrder(p['id']);
    })
    .subscribe((items: any) => {
        let tt = 0;
        _.each(items, (i: any) => {
          tt += i.total_nf;
        });
        items.total_total = tt;
        if (this.orderService.convertData) {
          this.orderService.convertOrders(
            this.orderId,
            this.orderService.convertData
          )
          .map((data: any) => {
            return data.data;
          })
          .subscribe((data: ConvertedOrder) => {
            this.convertedOrder.next(data);
          },
            (err: any) => {
              //return this.goBack();
            });
        } else {
          if (this.orderId) {
            this.router.navigate(['/shoppinglist', 'orders-preview', this.orderId]);
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
  
  sendOrder() {
    let order = {};
    this.convertedOrder
    .map((o: any) => {
      if (!o.order || !o.order.id) {
        this.toasterService.pop('error', 'No order data provided');
      }
      return o.order;
    }).filter(o => o && o.id)
    .do((o: any) =>{order = Object.assign({},o);})
    .switchMap((order: any) => this.orderService.sendOrderRequest(order.id))
    .subscribe((status: any) => {
      this.showEmailDataEditModal({
          email_text: status.email_text,
          po_number: order['po_number'],
          vendor_email: order['vendor_email_address'],
          user_email: this.userService.selfData.email_address
        });
      },
      (err: any) => {
      })
  }
  
  showEmailDataEditModal(data){
    if (!data.email_text){data.email_text = "Email text"}
    if (!data.po_number){data.po_number = "1234567890"}
    
    this.modal.open(EditEmailDataModal, this.modalWindowService.overlayConfigFactoryWithParams(data,true,"oldschool"));
  }
}