import { Component, OnInit, AfterViewInit} from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { AccountService } from '../../../core/services/account.service';
import { Router } from '@angular/router';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { Observable } from 'rxjs/Observable';
import {
  ItemModel, OrderModel, ReceiveProductsModel, StatusModel,
  StorageLocationModel
} from '../../../models/receive-products.model';
import * as _ from 'lodash';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
@DestroySubscribers()
export class ReceiveComponent implements OnInit, AfterViewInit {
  public subscribers: any = {};
  public searchKey:string= "";
  public locationArr: any = [];
  public inventoryGroupArr: any = [];
  public orders$: Observable<any>;
  
  public receiveProducts: any = new ReceiveProductsModel;
  public statusList: any = new StatusModel;
  
  constructor(
    public accountService: AccountService,
    public inventoryService: InventoryService,
    public router: Router,
    public pastOrderService: PastOrderService,
    public toasterService: ToasterService,
  ) {
    this.subscribers.locationSubscription = this.accountService.locations$.subscribe(r => this.locationArr = r );
    
    this.inventoryService.getNextInventory();
    this.subscribers.inventoryArrSubscription = this.inventoryService.collection$.subscribe(r => this.inventoryGroupArr = r);
    
    this.orders$ = this.pastOrderService.ordersToReceive$;
  
    this.subscribers.ordersSubscription = this.orders$.subscribe(res => {
      console.log(res);
      this.receiveProducts = new ReceiveProductsModel(res);
      this.receiveProducts.orders = this.receiveProducts.orders.map(order => {
        order = new OrderModel(order);
        order.items = order.items.map((item: any) => {
          let quantity = item.quantity;
          item.item_id = item.id;
          item.inventory_group_id = item.inventory_group.id;
          item = new ItemModel(item);
          item.status = [new StatusModel()];
          item.status[0].qty = quantity;
          item.status[0].type = 'receive';
          item.status[1] = new StatusModel();
          item.status[1].qty = 0;
          item.status[1].type = 'pending';
          item.storage_locations = [new StorageLocationModel()];
          return item;
        });
        return order;
      });
      console.log(this.receiveProducts);
    });

  }
  
  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  remove(product, status) {
    let removedStatus = _.remove(product.status, status);
    this.onchangeStatusQty(product);
  }
 
  save() {
    debugger;
    this.receiveProducts.orders.map((order) => {
      order.items.map(item => {
        item.status.map(status => {
          if(status.type === 'receive' || status.type === 'partial receive') {
            status.primary_status = true;
          }
          return status;
        })
      })
    });
    
    this.pastOrderService.onReceiveProducts(this.receiveProducts);
  }
  
  addProduct() {
    //product = product.status.push(new StatusModel({qty: 0, type: 'pending'}));
  }
  
  changeLocation(location, product) {
    product.location_id = location.id;
    product.location_name = location.name;
  }
  
  changeStatus(setStatus, product, curStatus) {
    curStatus.showStatusSelect = false;
    if (setStatus !== curStatus.type) {
      let filteredStatus = _.find(product.status, {'type':setStatus});
      if (curStatus.type === 'pending' && !filteredStatus) {
        product.status.push(new StatusModel({type: 'pending', qty: '0'}));
        curStatus.type = setStatus;
      }
      else if (filteredStatus) {
        this.toasterService.pop('error', `Status ${setStatus} exists for this product`);
      }
      else if (!filteredStatus) {
        curStatus.type = setStatus;
      }
    }
    // used setTimeout because materialize-select doesn't change the text
    setTimeout(() => { curStatus.showStatusSelect = true; }, 0.1);
    console.log(product.status);
    this.onchangeStatusQty(product);
  }
  
  onchangeStatusQty(product) {
    
    let pendingSum  = product.status.reduce((sum, currentStatus) => {

      if(currentStatus.type === 'pending' || currentStatus.type === 'return') {
        return +sum;
      }
      else {
        return +sum + Number(currentStatus.qty);
      }
    }, 0);
    
    product.status.map(currentStatus => {
      if(currentStatus.type === 'pending') {
        currentStatus.qty = product.quantity - +pendingSum;
      }
      return currentStatus;
    })
    
  }
  
}
