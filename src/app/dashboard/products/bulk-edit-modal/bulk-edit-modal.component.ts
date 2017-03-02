import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { AccountService, UserService } from '../../../core/services/index';
import { AccountVendorModel } from '../../../models/index';

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
  private subscribers: any = {};
  
  public departmentCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public workingStockCollection$: Observable<any> = new Observable<any>();
  public backStockCollection$: Observable<any> = new Observable<any>();
  public vendorCollection$: Observable<any> = new Observable<any>();
  
  private context: BulkEditModalContext;
  private selectedProducts:any;
  public bulk: any = {
    department: null,
    working_stock: null,
    category: null,
    back_stock: null,
    accounting: null,
    preferred_vendor: null,
    hazardous: null,
    perpetual: null,
    trackable: null,
    hidden: null,
    tax_exempt: null,
    reset_msds: null,
  };
  
  
  constructor(
    public dialog: DialogRef<BulkEditModalContext>,
    private userService: UserService,
    private accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
    this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
    //TODO
    this.workingStockCollection$  = this.accountService.getDepartments().take(1);
    this.backStockCollection$ = this.accountService.getDepartments().take(1);
    this.vendorCollection$ = this.accountService.getDepartments().take(1);
    
    this.selectedProducts =this.context.products;
    console.log(this.selectedProducts);
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
  
  saveBulkEdit(){
    //TODO
  }
}
