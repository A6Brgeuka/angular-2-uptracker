import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location }                 from '@angular/common';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { VendorModel, AccountVendorModel } from '../../../models/index';
import { UserService, AccountService } from '../../../core/services/index';
import { ActivatedRoute, Params } from '@angular/router';
import { VendorService } from '../../../core/services/vendor.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
@DestroySubscribers()
export class ViewVendorComponent implements OnInit {
  public subscribers: any = {};
  
  public globalVendor$;
  public vendor: any = {};
  public basicnfo: any = {};
  public accountVendors: any;
  public locationArr: any = [];
  //public locations$: Observable<any>;
  public all_locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any;
  public secondaryLocationArr: any = [];
  public locVendorChosen: boolean = false;
  public currencyArr: any = [];
  public currencySign: string;
  public body = document.getElementsByTagName("body")[0];
  
  public displayingVendor$: BehaviorSubject<any> = new BehaviorSubject({});
  public accauntVendors$: Observable<any>;
  
  @ViewChild('secondary') secondaryLocationLink: ElementRef;
  @ViewChild('all') allLocationLink: ElementRef;
  @ViewChild('primary') primaryLocationLink: ElementRef;
  public vendorId: string;
  
  constructor(
    public userService: UserService,
    public route: ActivatedRoute,
    public accountService: AccountService,
    public vendorService: VendorService,
    public location: Location,
  ) {
    this.globalVendor$ = this.vendorService.globalVendor$;
    this.all_locations$ = this.accountService.locations$;
  }
  
  ngOnInit() {
    
    this.accauntVendors$ = Observable.combineLatest(
      this.globalVendor$,
      this.vendorService.getAccountVendors()
    )
    .map(([globalVendor,vendors]: any) => {
       return _.filter(vendors, {'vendor_id': globalVendor['id']})
      }
    );

  }
  
  addSubscribers() {
  
    this.subscribers.allLocationsSubscription = this.all_locations$
    .subscribe((res: any) => {
    
      this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
    
      this.secondaryLocationArr = _.filter(res, (loc) => {
        return this.primaryLocation != loc;
      });
    
      if (this.secondaryLocationArr.length > 0) {
        this.secondaryLocation = this.secondaryLocationArr[0];
      }
    
      return this.secondaryLocationArr;
    
    });
    
    
    this.subscribers.accauntVendorsSubscription = this.accauntVendors$
    .subscribe((accauntVendors: AccountVendorModel[]) =>
      this.accountVendors = accauntVendors
    );
    
    
    this.subscribers.globalVendorSubscription = this.globalVendor$
    .subscribe(vendor => {
  
      this.vendor = new VendorModel(vendor);
  
      this.basicnfo = _.cloneDeep(new VendorModel(vendor));
  
      this.vendorId = this.vendor.id;
    });
    
  }
  
  ngAfterViewInit() {

    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$
    .subscribe((res: any) => {
      
      this.chooseTabLocation(res);
      if (this.secondaryLocationArr.length) {
        
        //if (this.secondaryLocationArr.length == 1) return;
  
        if (res ? res.id != this.primaryLocation.id : null) {
          this.secondaryLocationLink.nativeElement.click();
        }
        
        if (res && res.id == this.primaryLocation.id ) {
          this.primaryLocationLink.nativeElement.click();
        }
  
        if (!res) {
          this.allLocationLink.nativeElement.click();
        }
      }
      
    });
    // observer to detect class change
    
    //if (this.secondaryLocationLink) {
    //  // observer to detect class change
    //  let observer = new MutationObserver((mutations) => {
    //    mutations.forEach((mutation: any) => {
    //      if (mutation.attributeName === "class" && mutation.oldValue == 'active' && mutation.target.className == '') {
    //         //this.secondaryLocationLink.nativeElement.click();
    //        //debugger;
    //        this.chooseTabLocation(this.secondaryLocation);
    //      }
    //    });
    //  });
    //
    //  observer.observe(this.secondaryLocationLink.nativeElement, {
    //    attributes: true,
    //    attributeOldValue: true
    //  });
    //}
    
    this.currentLocation = this.vendorService.selectedTab;
    

    //if (this.currentLocation && this.primaryLocation !== this.currentLocation) {
    //  this.secondaryLocationLink.nativeElement.click();
    //}
    //
    //if (!this.currentLocation){
    //
    //  this.allLocationLink.nativeElement.click();
    //} else {
    //
    //  if (this.primaryLocation == this.currentLocation) {
    //    this.primaryLocationLink.nativeElement.click();
    //  } else {
    //    this.secondaryLocationLink.nativeElement.click();
    //  }
    //}
    
  }
  
  editVendor(vendor = null) {
    this.accountService.dashboardLocation$.next(this.currentLocation);
    this.goBack();
  }
  
  chooseTabSubLocation(event) {
    event.currentTarget.className = '';
  }
  
  chooseTabLocation(location = null) {
   
    this.vendorService.selectedTab = location;
    this.locVendorChosen = !!location;
    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      this.secondaryLocation = location;
      //this.secondaryLocationLink.nativeElement.click();
    }
    else if (!location && this.secondaryLocationArr.length) {
      this.allLocationLink.nativeElement.click();
    } else {
      this.sateliteLocationActive = false;
    }
    this.currentLocation = location;
    // account vendor general info
    let generalAccountVendor: any = _.cloneDeep(_.find(this.accountVendors, {'location_id': null}));

    this.vendor = new VendorModel(this.basicnfo);

    // account vendor info for specific location
    let locationAccountVendor: AccountVendorModel = new AccountVendorModel(_.find(this.accountVendors, {'location_id': this.currentLocation ? this.currentLocation.id : null}) || null);
    // fill vendor info for modal view vendor
    
    console.log(locationAccountVendor);
    
    _.each(locationAccountVendor, (value, key) => {
      if (generalAccountVendor && generalAccountVendor[key]) {
        this.vendor[key] = generalAccountVendor[key];
      }
      if (value)
        this.vendor[key] = value;
    });
    
    this.subscribers.getCurrenciesSubscription = this.accountService.getCurrencies().subscribe((res: any) => {
      this.currencyArr = res;
      //this.vendor.discount_percentage = this.vendor.discount_percentage ? this.vendor.discount_percentage * 100 : null;
      let currentVendorCurrency: any = _.find(res, {'iso_code': this.vendor.currency ? this.vendor.currency : "USD"});
      this.currencySign = currentVendorCurrency.html_entity;
    });
    
  }
  
  goBack(): void {
    this.location.back();
  }
  
}
