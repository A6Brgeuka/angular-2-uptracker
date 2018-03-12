import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../core/services/account.service';
import { DialogRef } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import * as _ from 'lodash';

export class AddNewProductModalContext extends BSModalContext {

}

@Component({
  selector: 'app-add-new-product-modal',
  templateUrl: './add-new-product-modal.component.html',
  styleUrls: ['add-new-product-modal.component.scss']
})
@DestroySubscribers()
export class AddNewProductModalComponent implements OnInit {
  public subscribers: any = {};

  public variants: any = {};
  public product: any = {};
  public step: number = 0;
  public vendor = {vendor_name:null, vendor_id:null, location_id: 'all'};
  public departmentCollection$: Observable<any> = new Observable<any>();
  public departmentCollection: any[];
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection: any[];
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection: any[];

  public productVariants = {
    color: ['green', 'blue', 'navy'],
    size: ['s', 'm', 'xl'],
    length: ['1', '3', '5'],
    strength: ['examlpe1', 'examlpe2', 'examlpe3'],
    texture: ['examlpe1', 'examlpe2', 'examlpe3'],
    prescription: ['examlpe1', 'examlpe2', 'examlpe3'],
    grit: ['examlpe1', 'examlpe2', 'examlpe3'],
    type: ['examlpe1', 'examlpe2', 'examlpe3']
  };

  constructor(
    private accountService: AccountService,
    public dialog: DialogRef<AddNewProductModalContext>
  ) {

  }

  ngOnInit() {
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
    this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
  }

  addSubscribers() {
    this.subscribers.departmenCollectiontSubscription = this.departmentCollection$
      .subscribe(departments => this.departmentCollection = departments);

    this.subscribers.productAccountingCollection = this.productAccountingCollection$
      .subscribe(products => this.productAccountingCollection = products);

    this.subscribers.productCategoriesCollection = this.productCategoriesCollection$
      .subscribe(productsCat => this.productCategoriesCollection = productsCat);
  }

  nextStep() {
    this.step++;
  }

  isLastStep() {
    return this.step == 3;
  }

  canProceed() {
    if (this.step == 0) {
      return this.product.name;
    }
    if (this.step == 1) {
      return _.some(this.variants, (val, key) =>  val);
    }
    return true;
  }

  checkStep(step) {
    return this.step == step;
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  getVariants() {
    return _.forEach(this.variants, (val, key) => val ? key : false);
  }

  selectedAutocompletedVendor(vendor) {
    if (!(this.vendor && !vendor.vendor_id && this.vendor.vendor_name === vendor)) {
      this.vendor = (vendor.vendor_id) ? vendor : {vendor_name: vendor, vendor_id: null};
    }
  }

  uploadLogo(file: any) {
    const reader = new FileReader();
    reader.onload = ($event: any) => this.product.image = $event.target.result;
    reader.readAsDataURL(file.target.files[0]);
  }
}
