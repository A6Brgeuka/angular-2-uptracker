import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-variant-short-detail',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './variant-short-detail.component.html',
  styleUrls: ['./variant-short-detail.component.scss']
})
@DestroySubscribers()
export class VariantShortDetailComponent implements OnInit {
  public locationArr: any;

  @Input("variant") public variant;
  @Input("product_id") public product_id;
  @Input("showEdit") public showEdit;

  @Output() addToOrderWithVendor: EventEmitter<any> = new EventEmitter();

  private subscribers: any = {};

  constructor(
    public accountService: AccountService,

) {
    this.subscribers.locationSubscribtion = this.accountService.locations$
    .subscribe(r=>{this.locationArr = r});

  }

  ngOnInit() {
  }

  addToOrder(item) {
    this.addToOrderWithVendor.emit(item);
  }
  vendorHeaderCheckboxChange(event) {
    this.variant.vendor_variants.forEach((item) => {
      item.checked = event;
      return item;
    })
  }

  vendorLineCheckboxChange() {
    const filterChecked = _.filter(this.variant.vendor_variants, {checked: true});
    this.variant.checked = !!(filterChecked && filterChecked.length === this.variant.vendor_variants.length);
  }
}
