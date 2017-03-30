import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { AccountService, UserService } from '../../../core/services/index';
import { AccountVendorModel } from '../../../models/index';
import { ProductService } from '../../../core/services/product.service';

export class BulkEditModalContext extends BSModalContext {
  public products: any;
}

@Component({
  selector: 'app-edit-product-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './bulk-edit-modal.component.html',
  styleUrls: ['./bulk-edit-modal.component.scss']
})
@DestroySubscribers()
export class BulkEditModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<BulkEditModalContext> {
  public subscribers: any = {};
  
  public departmentCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public workingStockCollection$: Observable<any> = new Observable<any>();
  public backStockCollection$: Observable<any> = new Observable<any>();
  public vendorCollection$: any = new BehaviorSubject(false);
  public additionalInfo$: Observable<any> = new Observable<any>();
  public dataObj:any ={};
  public data:any = [];
  
  public context: BulkEditModalContext;
  public selectedProducts:any;
  public bulk: any = {
    department: null, //
    working_stock: null,
    category: null, //
    back_stock: null,
    account_category: null, //
    vendor: null,
    hazardous: null, //
    perpetual_inventory: null,
    trackable: null, //
    status: null, //
    tax_exempt: null, //
    reset_msds: null, //
  };
  
  
  constructor(
    public dialog: DialogRef<BulkEditModalContext>,
    public userService: UserService,
    public accountService: AccountService,
    public productService: ProductService,

  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    
    this.selectedProducts =this.context.products;
    console.log(this.selectedProducts);
    
    this.dataObj.product_ids = [];
    _.map(this.selectedProducts, (prod:any)=>{
      this.dataObj.product_ids.push(prod['id']);
    });
  
    this.additionalInfo$ = this.productService.getBulkEditAdditionalInfo(this.dataObj.product_ids)
    .take(1)
    .map(resp => {
      this.vendorCollection$.next(resp.data.vendors);
      return resp.data;
    });
  
    console.log(this.dataObj);
    
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
    this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
    //TODO
    this.workingStockCollection$  = this.accountService.getDepartments().take(1);
    this.backStockCollection$ = this.accountService.getDepartments().take(1);
    
    
    
    this.additionalInfo$.subscribe(r=>console.log('additional',r));
    this.vendorCollection$.subscribe(r=>console.log('vendors',r));
  }
  
  ngAfterViewInit() {
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
  onSubmit() {
      
  }
  
  checkboxChange(event, value) {
    if (!event.target.state || event.target.state == 3) {
      event.target.state = 1;
    }
    else {
      event.target.state++;
    }
    switch (event.target.state) {
      case 1: event.target.checked = true;
       event.target.indeterminate = false;
        value = true;
        break;
      case 2: event.target.checked = false;
       event.target.indeterminate = false;
        value = false;
        break;
      case 3: event.target.checked = false;
       event.target.indeterminate = true;
        value = null;
        break;
    }
  }
  
  saveBulkEdit() {
    _.forIn(this.bulk, (value, key) => {
      if (value !== null) {
        this.dataObj[key] = value;
      }
    });
    
    console.log(this.dataObj);
    this.subscribers.updateBulkProducts$ = this.productService.bulkUpdateProducts(this.dataObj);
    this.dismissModal();
  }
}
