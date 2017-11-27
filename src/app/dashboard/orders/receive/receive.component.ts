import { Component, OnInit} from '@angular/core';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { AccountService } from '../../../core/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PastOrderService } from '../../../core/services/pastOrder.service';
import { InventoryService } from '../../../core/services/inventory.service';
import {
  ItemModel, OrderModel, ReceiveProductsModel, StatusModel,
  StorageLocationModel
} from '../../../models/receive-products.model';
import * as _ from 'lodash';
import { ToasterService } from '../../../core/services/toaster.service';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';
import { AddInventoryModal } from '../../inventory/add-inventory/add-inventory-modal.component';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-order-detail',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
@DestroySubscribers()
export class ReceiveComponent implements OnInit {
  public subscribers: any = {};
  public searchKey:string= "";
  public locationArr: any = [];
  public inventoryGroupArr: any = [];
  public orders$: BehaviorSubject<any> = new BehaviorSubject([]);
  
  public receiveProducts: any = new ReceiveProductsModel;
  public statusList: any = this.pastOrderService.statusList;
  public packingSlipValid: boolean = true;
  public newInventory$: ReplaySubject<any> = new ReplaySubject(1);
  
  constructor(
    public accountService: AccountService,
    public inventoryService: InventoryService,
    public router: Router,
    public pastOrderService: PastOrderService,
    public toasterService: ToasterService,
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public route: ActivatedRoute,
  ) {
  
  }
  
  ngOnInit() {
    this.inventoryService.getNextInventory();
  }
  
  addSubscribers() {
    
    this.subscribers.getReceiveProductSubscription = this.route.params
    .switchMap(param =>
      this.pastOrderService.getReceiveProduct(param.queryParams)
    )
    .subscribe(res => this.updateOrders(res));
    
    this.subscribers.locationSubscription = this.accountService.locations$
    .subscribe(r => this.locationArr = r);
    
    this.subscribers.inventoryArrSubscription = this.inventoryService.collection$
    .subscribe(r => this.inventoryGroupArr = r);
    
    this.subscribers.ordersSubscription = this.orders$
    .subscribe(res => {
      this.receiveProducts = new ReceiveProductsModel(res);
      this.receiveProducts.orders = this.receiveProducts.orders.map(order => {
        order = new OrderModel(order);
        order.items = order.items.map((item: any) => {
          const quantity = item.quantity;
          item.item_id = item.id;
          item.inventory_group_id = item.inventory_group.id;
          if (item.inventory_group_id) {
            item.existInvGroup = true;
            item.inventory_group.locations = _.filter(item.inventory_group.locations, ['location_id', item.location_id]);
          };
          
          item = new ItemModel(item);
          item.status = [new StatusModel(item)];
          item.status[0].qty = quantity;
          item.status[0].type = 'receive';
          item.status[0].tmp_id = 'tmp' + Math.floor(Math.random() * 1000000);
          if (item.existInvGroup) {
            item.status[0].storage_location_id = item.inventory_group.locations[0].storage_locations[0].id;
          }
          item.status[1] = new StatusModel(item);
          item.status[1].qty = 0;
          item.status[1].type = 'pending';
          item.status[1].tmp_id = 'tmp' + Math.floor(Math.random() * 1000000);
  
          item.storage_locations = [new StorageLocationModel()];
          return item;
        });
        console.log(order);
        return order;
      });
      
    });
  
    this.subscribers.getProductFieldSubscription =
      this.newInventory$
    .switchMap((product:any) => {
      return this.pastOrderService.getProductFields(product.variant_id)
      .map(res => {
        this.modal
        .open(AddInventoryModal, this.modalWindowService.overlayConfigFactoryWithParams({'selectedProduct': res, 'inventoryItems':[]}))
        .then((resultPromise) => {
          resultPromise.result.then(
            (res) => {
              product.inventory_group_id = res.id;
            },
            (err) => {}
          );
        });
      })
    })
    .subscribe();
    
  }

  updateOrders(orders) {
    this.orders$.next(orders);
  }
  
  remove(product, status) {
    let removedStatus = _.remove(product.status, status);
    this.onchangeStatusQty(product, status, status.qty);
  }
 
  save() {
    if (this.receiveProducts.packing_slip_number) {
      this.receiveProducts.orders.map((order) => {
        order.items.map(item => {
          item.status.map(status => {
            if (status.type === 'receive' || status.type === 'partial receive') {
              status.primary_status = true;
            }
            if ((status.type === 'receive' || status.type === 'partial receive' || status.type === 'quantity increase' || status.type === 'quantity decrease') && !status.storage_location_id) {
              status.storage_location_id = item.inventory_group.locations[0].storage_locations[0].id;
            }
            return status;
          });
        });
      });
  
      this.pastOrderService.onReceiveProducts(this.receiveProducts);
    } else {
      this.packingSlipValid = false;
    }
  }
  
  addProduct() {
  
  }
  
  changeLocation(location, status, product) {
    status.storage_location_id = location.id;
    status.location_id = product.location_id;
  }
  
  changeStatus(setStatus, product, curStatus) {
    curStatus.showStatusSelect = false;
    if (setStatus !== curStatus.type) {
      const filteredStatus = _.find(product.status, {'type': setStatus});
      const findIncreaseStatus = _.find(product.status, {'type': 'quantity increase'});
      const findDecreaseStatus = _.find(product.status, {'type': 'quantity decrease'});
      const findReceiveStatus = _.find(product.status, {'type': 'receive'});
      let quantityStatus: boolean = false;
      let receiveStatus: boolean = false;
      
      if ((findIncreaseStatus && setStatus === 'quantity decrease' && curStatus.type !== 'quantity increase')
        || (findDecreaseStatus && setStatus === 'quantity increase' && curStatus.type !== 'quantity decrease')) {
        this.toasterService.pop('error', `You can set either quantity decrease or quantity increase status`);
        quantityStatus = true;
      }
  
      if (findReceiveStatus && setStatus === 'partial receive' && curStatus.type !== 'receive'){
        this.toasterService.pop('error', `You can set either receive or partial receive status`);
        receiveStatus = true;
      }
      
      if (curStatus.type === 'pending' && (!filteredStatus || filteredStatus.type === 'partial receive') && !quantityStatus && !receiveStatus) {
        product.status.push(new StatusModel({
          type: 'pending',
          qty: '0',
          location_id: product.location_id,
          tmp_id: 'tmp' + Math.floor(Math.random() * 1000000)
        }));
        curStatus.type = setStatus;
      } else if (filteredStatus && (filteredStatus.type !== 'partial receive') && !quantityStatus && !receiveStatus) {
        this.toasterService.pop('error', `Status ${setStatus} exists for this product`);
      } else if ((!filteredStatus || filteredStatus.type === 'partial receive') && !quantityStatus && !receiveStatus) {
        curStatus.type = setStatus;
      }
      
    }
    // used setTimeout because materialize-select doesn't change the text
    setTimeout(() => { curStatus.showStatusSelect = true; }, 0.1);
    console.log(product.status);
    this.onchangeStatusQty(product, curStatus, curStatus.qty);
  }
  
  onchangeStatusQty(product, status, newValue) {
    status.qty = newValue;
    
    const pendingSum  = product.status.reduce((sum, currentStatus) => {
      if (currentStatus.type === 'pending') {
        return +sum;
      } else {
        return +sum + Number(currentStatus.qty);
      }
    }, 0);
    
    product.status.map(currentStatus => {
      
      if (currentStatus.type === 'pending') {
        currentStatus.qty = product.quantity - +pendingSum;
        if (currentStatus.qty < 0) {
            this.toasterService.pop('error', `The full amount should not be more than ${product.quantity}`);
            status.qty = Number(status.qty) + Number(currentStatus.qty);
            currentStatus.qty = 0;
        }
      }
      
      if (currentStatus.type === 'receive' && Number(currentStatus.qty) < Number(product.quantity)) {
        currentStatus.type = 'partial receive';
      }
      
      if (currentStatus.type === 'partial receive'
        && Number(currentStatus.qty) === Number(pendingSum)
        && Number(currentStatus.qty) === Number(product.quantity)) {
        currentStatus.type = 'receive';
        _.remove(product.status, {'type': 'partial receive'});
        product.status[product.status.length-1].qty = 0;
      }
      
      const filterPartReceiveStatus:any[] = _.filter(product.status, {'type': 'partial receive'});
      if (filterPartReceiveStatus.length && currentStatus.type === 'partial receive' && currentStatus.tmp_id === filterPartReceiveStatus[0].tmp_id) {
        currentStatus.inventoryHide = true;
      } else if (filterPartReceiveStatus.length && currentStatus.type === 'partial receive' && currentStatus.tmp_id !== filterPartReceiveStatus[0].tmp_id) {
        currentStatus.inventoryHide = false;
      }
      
      return currentStatus;
    });
  }
  
  changeInventory(invenory, product) {
    if (invenory === 'routerLink') {
      this.openAddInventoryModal(product);
    }
  }
  
  openAddInventoryModal(product) {
    this.newInventory$.next(product);
  }
  
}
