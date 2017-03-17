import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location }                 from '@angular/common';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { VendorModel, AccountVendorModel } from '../../../models/index';
import { UserService, AccountService, ModalWindowService } from '../../../core/services/index';
import { ActivatedRoute, Params } from '@angular/router';
import { VendorService } from '../../../core/services/vendor.service';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
@DestroySubscribers()
export class ViewVendorComponent implements OnInit {
  private subscribers: any = {};
  public vendor: any = {};
  private accountVendors: any;
  public locationArr: any = [];
  public locations$: Observable<any>;
  public all_locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any;
  public secondaryLocationArr: any = [];
  public locVendorChosen: boolean = false;
  private currencyArr: any = [];
  public currencySign: string;
  public body = document.getElementsByTagName("body")[0];
  
  @ViewChild('secondary') secondaryLocationLink: ElementRef;
  private vendorId: string;
  
  constructor(
    public userService: UserService,
    private route: ActivatedRoute,
    public accountService: AccountService,
    private vendorService: VendorService,
    private location: Location,
    private modalWindowService: ModalWindowService
  ) {
  }
  
  ngOnInit() {
    this.route.params
    .switchMap((params: Params) => this.vendorService.getVendor(params['id']))
    .map((v: any) => v.data.vendor)
    .subscribe(vendor => {
      this.vendor = new VendorModel(vendor);
      this.all_locations$ = this.accountService.locations$;
      this.locations$ = this.accountService.locations$
      .map((res: any) => {
        console.log('locations', res);
        this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
        this.secondaryLocationArr = _.filter(res, (loc) => {
          return this.primaryLocation != loc;
        });
        if (this.secondaryLocationArr.length > 0)
          this.secondaryLocation = this.secondaryLocationArr[0];
        return this.secondaryLocationArr;
      });
      
    });
  }
  
  ngAfterViewInit() {
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
      this.chooseTabLocation(res);
      if (this.secondaryLocationArr.length == 1) return;
      if (res ? res.id != this.primaryLocation.id : null) {
        this.secondaryLocationLink.nativeElement.click();
      }
    });
    // observer to detect class change
    if (this.secondaryLocationLink) {
      // observer to detect class change
      let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation: any) => {
          if (mutation.attributeName === "class" && mutation.oldValue == 'active' && mutation.target.className == '') {
            // this.secondaryLocationLink.nativeElement.click();
            this.chooseTabLocation(this.secondaryLocation);
          }
        });
      });
      observer.observe(this.secondaryLocationLink.nativeElement, {
        attributes: true,
        attributeOldValue: true
      });
    }
  }
  
  
  editVendor(vendor = null) {
    this.accountService.dashboardLocation$.next(this.currentLocation);
    this.goBack();
  }
  
  chooseTabLocation(location = null) {
  
    this.locVendorChosen = location ? true : false;
    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      this.secondaryLocation = location;
    } else {
      this.sateliteLocationActive = false;
    }
    this.currentLocation = location;
    
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
    this.subscribers.getCurrenciesSubscription = this.accountService.getCurrencies().subscribe((res: any) => {
      this.currencyArr = res;
      this.vendor.discount_percentage = this.vendor.discount_percentage ? this.vendor.discount_percentage * 100 : null;
      let currentVendorCurrency: any = _.find(res, {'iso_code': this.vendor.currency ? this.vendor.currency : "USD"});
      this.currencySign = currentVendorCurrency.html_entity;
    });
  }
  
  
  goBack(): void {
    this.location.back();
  }
  
}
