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

@Component({
  selector: 'app-order-detail',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
@DestroySubscribers()
export class ReceiveComponent implements OnInit, AfterViewInit {
  
  public searchKey:string= "";
  public mockItems:number[] = [0,0,0,0,0,0];
  public locationArr: any = [];
  public inventoryGroupArr: any = [];
  public tempArr: any = [];
  public orders$: Observable<any>;
  
  public receiveProducts: any = new ReceiveProductsModel;
  public statusList: any = new StatusModel;
  
  constructor(
    public accountService: AccountService,
    public inventoryService: InventoryService,
    public router: Router,
    public pastOrderService: PastOrderService
  ) {
    this.accountService.locations$
    .subscribe(r => this.locationArr = r );

    this.inventoryService.collection$.subscribe(r => this.inventoryGroupArr = r);
    
    this.orders$ = this.pastOrderService.ordersToReceive$;

    this.orders$.subscribe(res => {
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
          item.status = item.status.map(status => {
            if(status.type === 'receive' || status.type === 'partial receive') {
              status.primary_status = true;
            }
            return status;
          });
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
    product = _.remove(product.status, status);
  }
 
  save() {
    this.pastOrderService.onReceiveProducts(this.receiveProducts);
  }
  
  addProduct(product) {
    //product = product.status.push(new StatusModel({qty: 0, type: 'pending'}));
  }
  
}
