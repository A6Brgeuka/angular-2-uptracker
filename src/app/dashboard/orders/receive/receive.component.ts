import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Modal } from 'angular2-modal';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';

import { AccountService } from '../../../core/services/account.service';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { InventoryService } from '../../../core/services/inventory.service';
import {
  ItemModel, OrderModel, ReceiveProductsModel, StatusModel,
  StorageLocationModel
} from '../../../models/receive-products.model';
import { ToasterService } from '../../../core/services/toaster.service';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ReceivedOrderService } from '../../../core/services/received-order.service';
import { ReceiveFormGroup, ReceiveVendor } from './models/receive-form.model';
import { Observable } from 'rxjs/Observable';
import { ReceiveService } from './receive.service';
import { Subject } from 'rxjs/Subject';
import { ConfirmModalService } from '../../../shared/modals/confirm-modal/confirm-modal.service';


@Component({
  selector: 'app-order-detail',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
@DestroySubscribers()
export class ReceiveComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public searchKey:string= "";
  public locationArr: any = [];

  public receiveProducts: any = new ReceiveProductsModel;
  public packingSlipValid: boolean = true;
  public inventoryGroupValid: boolean = true;
  public getReceiveProducts$: ReplaySubject<any> = new ReplaySubject(1);
  public saveReceiveProducts$: ReplaySubject<any> = new ReplaySubject(1);

  public openConfirmModal$: Subject<any> = new Subject();

  public receiveOrdersForm: FormGroup;

  public invoice$: Observable<any>;

  public formSubmitted$: Observable<boolean>;

  public invoiceVendor$: Observable<ReceiveVendor>;

  constructor(
    public accountService: AccountService,
    public inventoryService: InventoryService,
    public router: Router,
    public pastOrderService: PastOrderService,
    public receivedOrderService: ReceivedOrderService,
    public toasterService: ToasterService,
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public route: ActivatedRoute,
    public receiveService: ReceiveService,
    public location: Location,
    public confirmModalService: ConfirmModalService,
  ) {
  }

  get vendorName() {
    const control = this.receiveOrdersForm.get(['vendor', 'vendor_name']);
    return control && control.value;
  }

  get packingSlipNumberControl() {
    return this.receiveOrdersForm.get('packing_slip_number');
  }

  get invoiceNumberControl() {
    return this.receiveOrdersForm.get('invoice_number');
  }

  ngOnInit() {

    this.invoice$ = this.route.params
    .switchMap((params) => this.receiveService.takeInvoiceData(params));

    this.formSubmitted$ = this.receiveService.formSubmitted$;

    // this.receiveService.takeInvoiceData(this.route.params);

    // this.invoice$ = this.route.params
    // .switchMap(param =>
    //   this.receivedOrderService.getReceiveProduct(param.queryParams)
    // )
    // .shareReplay(1);

    // const invoiceOrders$: Observable<any[]> = this.invoice$
    // .map((invoice) => invoice.orders);

    // const orderEntities$: Observable<any> = invoiceOrders$
    // .map((invoiceOrders) =>
    //   invoiceOrders.reduce((entities, order) => ({
    //     ...entities,
    //     [order.order_id]: order,
    //   }), {})
    // );
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  createForm(invoice) {
    this.receiveOrdersForm = new ReceiveFormGroup(invoice);
  }

  addSubscribers() {

    this.subscribers.getReceiveProductSubscription = this.invoice$
    .subscribe((res: any) => {
      this.createForm(res);
      // debugger
      // this.receiveProducts = new ReceiveProductsModel(res);
      // this.receiveProducts.orders = this.receiveProducts.orders.map(order => {
      //   order = new OrderModel(order);
      //   order.items = order.items.map((item: any) => {
      //
      //     let quantity = item.quantity;
      //     item.item_id = item.id;
      //
      //     if (item.inventory_group_id && item.inventory_group) {
      //       item.existInvGroup = true;
      //       item.inventory_groups = [item.inventory_group];
      //       this.transformStorageLocations(item);
      //     } else {
      //       item.inventory_groups.unshift({
      //           name: 'Create New Inventory Group',
      //           id: 'routerLink'
      //         });
      //     };
      //
      //     item = new ItemModel(item);
      //
      //     item.status = [new StatusModel(item)];
      //     item.status[0].qty = quantity;
      //     item.status[0].type = 'receive';
      //     item.status[0].tmp_id = 'tmp' + Math.floor(Math.random() * 1000000);
      //     if (item.existInvGroup) {
      //       item.status[0].storage_location_id = item.inventory_group.locations[0].storage_locations[0].id;
      //     }
      //     item.status[1] = new StatusModel(item);
      //     item.status[1].qty = 0;
      //     item.status[1].type = 'pending';
      //     item.status[1].tmp_id = 'tmp' + Math.floor(Math.random() * 1000000);
      //
      //     item.storage_locations = [new StorageLocationModel()];
      //     return item;
      //   });
      //   return order;
      // });
      //
    });

    this.subscribers.saveReceiveProductSubscription = this.saveReceiveProducts$
    .switchMap((data) => this.receivedOrderService.onReceiveProducts(data))
    .subscribe(() => {
      this.toasterService.pop('', 'Successfully received');
      this.location.back();
    });

    this.subscribers.openConfirmModalSubscription = this.openConfirmModal$
    .switchMap(() => this.confirmModalService.confirmModal(
      'Save?', {text: 'Do you want to save the applied changes?', btn: 'Save'}
    )).subscribe(res => {
      if (res.success) {
        this.save();
      }
      this.location.back();
    });

  }

  updateInvoice() {
    this.invoice$ = this.route.params
    .switchMap((params) => this.receiveService.takeInvoiceData(params));
  }

  goBack() {
    this.openConfirmModal$.next('');
  }

  // transformStorageLocations(item) {
  //   let locations = item.inventory_group.locations.reduce((acc: any[], location) => {
  //
  //     const array = location.storage_locations.map(storage_location => ({
  //       location_id: location.location_id,
  //       location_name: location.name,
  //       ...storage_location
  //     }));
  //
  //     return [...acc, array];
  //   }, []);
  //   item.locations = _.flatten(locations);
  // }

  save() {
    this.receiveService.formSubmitted();
    console.log('Save will be implemented later');
    console.log(this.receiveOrdersForm.value);
    console.log(this.receiveOrdersForm);
    if (this.receiveOrdersForm.valid) {
      this.saveReceiveProducts$.next(this.receiveOrdersForm.value);
    }
    // if (this.receiveProducts.packing_slip_number) {
    //   this.receiveProducts.orders.map((order) => {
    //     order.items.map(item => {
    //       if (item.inventory_group_id) {
    //         item.status.map(status => {
    //           if (status.type === 'receive' || status.type === 'partial receive') {
    //             status.primary_status = true;
    //           }
    //           if ((status.type === 'receive' || status.type === 'partial receive' || status.type === 'quantity increase' || status.type === 'quantity decrease') && !status.storage_location_id) {
    //             status.storage_location_id = item.inventory_group.locations[0].storage_locations[0].id;
    //           }
    //           return status;
    //         });
    //       } else {
    //         this.inventoryGroupValid = false;
    //       }
    //     });
    //   });
    //   if (this.inventoryGroupValid) {
    //     this.saveReceiveProducts$.next('');
    //   }
    //
    // } else {
    //   this.packingSlipValid = false;
    //   this.inventoryGroupValid = false;
    // }
  }

  addProduct() {

  }

}
