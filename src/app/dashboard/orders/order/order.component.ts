import {
  Component, OnInit
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { Location }                 from '@angular/common';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ModalWindowService } from "../../../core/services/modal-window.service";
import { UserService } from '../../../core/services/user.service';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConvertedOrder } from '../../../core/services/order.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { Subject } from 'rxjs/Subject';
import { PastOrderService } from '../../../core/services/pastOrder.service';


@Component({
  selector: 'app-purchase-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
@DestroySubscribers()
export class OrderComponent implements OnInit {
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public orderId: string;
  deleteOrder$: Subject<ConvertedOrder> = new Subject();
  order$: BehaviorSubject<any> = new BehaviorSubject({});
  currentPage$: BehaviorSubject<number> = new BehaviorSubject(0);
  
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public windowLocation: Location,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public pastOrderService: PastOrderService,
    public router: Router,
    public toasterService: ToasterService,
  ) {
  
  }
  
  ngOnInit() {
    
    this.route.params
    .switchMap((p: Params) => {
      this.orderId = p['id'];
      return this.pastOrderService.getPastOrder(p['id']);
    })
    .subscribe((item: any) => {
      console.log(item);
      this.order$.next(item);
    });
    
  }
  
  goBack(): void {
    this.windowLocation.back();
  }
  
 
}