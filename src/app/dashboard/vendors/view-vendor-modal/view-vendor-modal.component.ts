import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { VendorModel, LocationModel, AccountVendorModel } from '../../../models/index';
import { UserService, AccountService, ModalWindowService } from '../../../core/services/index';

export class ViewVendorModalContext extends BSModalContext {
  public vendor: VendorModel;
}

@Component({
  selector: 'app-view-vendor-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './view-vendor-modal.component.html',
  styleUrls: ['./view-vendor-modal.component.scss']
})
@DestroySubscribers()
export class ViewVendorModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<ViewVendorModalContext> {
  private subscribers: any = {};
  context: ViewVendorModalContext;
  public vendor: any = {};
  private accountVendors: any;
  public locationArr: any = [];
  public locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any;
  public secondaryLocationArr: any = [];
  public locVendorChosen: boolean = false;
  private currencyArr: any = [];
  public currencySign: string;

  @ViewChild('secondary') secondaryLocationLink: ElementRef;

  constructor(
      public dialog: DialogRef<ViewVendorModalContext>,
      public userService: UserService,
      public accountService: AccountService,
      private modalWindowService: ModalWindowService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    this.accountVendors = this.context.vendor.account_vendor;
    this.vendor = new VendorModel(this.context.vendor);
    this.locations$ = this.accountService.locations$
        .map((res: any) => {
          this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
          this.secondaryLocationArr = _.filter(res, (loc) => {
            return this.primaryLocation != loc;
          });
          if (this.secondaryLocationArr.length > 0)
            this.secondaryLocation = this.secondaryLocationArr[0];
          return this.secondaryLocationArr;
        });

    this.subscribers.getCurrenciesSubscription = this.accountService.getCurrencies().subscribe((res: any) => {
      this.currencyArr = res;
    });
  }

  ngAfterViewInit(){
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
      this.chooseTabLocation(res);
      if (this.secondaryLocationArr.length == 1) return;
      if (res ? res.id != this.primaryLocation.id : null){
        this.secondaryLocationLink.nativeElement.click();
      }
    });

    // observer to detect class change
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation: any) => {
        if (mutation.attributeName === "class" && mutation.oldValue == 'active' && mutation.target.className == '') {
          // this.secondaryLocationLink.nativeElement.click();
          this.chooseTabLocation(this.secondaryLocation);
        }
      });
    });
    observer.observe(this.secondaryLocationLink.nativeElement,  {
      attributes: true,
      attributeOldValue: true
    });
  }

  dismissModal(){
    this.dialog.dismiss();
    this.modalWindowService.setScrollPosition();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  editVendor(vendor = null){
    this.accountService.dashboardLocation$.next(this.currentLocation);
    this.closeModal(vendor);
  }

  chooseTabLocation(location = null){
    this.locVendorChosen = location ? true : false;
    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      this.secondaryLocation = location;
    } else {
      this.sateliteLocationActive = false;
    }
    this.currentLocation = location;

    // global vendor info
    this.vendor = new VendorModel(this.context.vendor);
    // account vendor general info
    let generalAccountVendor: any = _.cloneDeep(_.find(this.accountVendors, {'location_id': null}));
    // account vendor info for specific location
    let locationAccountVendor: AccountVendorModel = new AccountVendorModel(_.find(this.accountVendors, {'location_id': this.currentLocation ? this.currentLocation.id : null}) || null);
    // fill vendor info for modal view vendor
    _.each(locationAccountVendor, (value, key) => {
      if (generalAccountVendor && generalAccountVendor[key])
          this.vendor[key] = generalAccountVendor[key];
      if (value)
          this.vendor[key] = value;
    });
    this.vendor.discount_percentage = this.vendor.discount_percentage ? this.vendor.discount_percentage * 100 : null;
    let currentVendorCurrency: any = _.find(this.currencyArr, {'iso_code': this.vendor.currency});
    this.currencySign = currentVendorCurrency.html_entity;
  }
}
