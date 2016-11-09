import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { VendorResource } from '../../core/resources/index';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class VendorService extends ModelService{
  collection$;
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();


  constructor(
      public injector: Injector,
      public vendorResource: VendorResource,
      public userService: UserService,
      public accountService: AccountService
  ) {
    super(injector, vendorResource);

    this.onInit();
  }

  onInit(){
    this.selfData$ = Observable.merge(
        this.updateSelfData$
    );
    this.selfData$.subscribe((res) => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);

      //update user after update account
      this.userService.updateSelfDataField('account', this.selfData);
    });

    // combine global vendors with account vendors
    // this.collection$ = Observable
    //     .combineLatest(
    //         super.collection$,
    //         this
    //     )
    //     .map(([vendors, user, sortBy, searchKey]) => {
    //
    //       return _.sortBy(filteredVendors, [sortBy]);
    //     });
  }

  addSubscribers(){
    this.entity$.subscribe((res) => {
      //update user after update account
      // this.userService.updateSelfDataField('account', res);

      this.updateSelfData(res);
    });
  }

  updateSelfData(data){
    this.updateSelfData$.next(data);
  }

  getVendors(){
    let vendorsLoaded = this.selfData ? this.selfData.length : false;
    if (!vendorsLoaded) {
      return this.resource.getVendors().$observable
          .map((res: any) => {
            return res.data.vendors;
          })
          .do((res: any) => {
            this.updateCollection$.next(res);
          });
    }
  }

  getVendor(id){
    let data = {
      id: id
    };
    return this.resource.getVendor(data).$observable;
  }

  searchVendor(query){
    let data = {
      query: query
    };
    return this.resource.searchVendors(data).$observable;
  }

  getAccountVendors(){
    let data: any = {
      account_id: this.userService.selfData.account_id
    };
    let vendorsLoaded = this.userService.selfData.account.vendors ? this.userService.selfData.account.vendors.length : false;
    if (!vendorsLoaded) {
      return this.resource.getVendors(data).$observable.do((res: any) => {
        let account = this.userService.selfData.account;
        account.vendors = res.data.vendors;
        this.accountService.updateSelfData(account);
      });
    }
  }

  addAccountVendor(data){
    let account = this.userService.selfData.account;

    // if new vendor push him to account vendors array, else update vendor in array
    if (!data.id) {
      return this.resource.addAccountVendor(data).$observable.do((res: any) => {
        account.vendors.push(res.data.vendor);
        this.accountService.updateSelfData(account);
      });
    } else {
      return this.resource.editAccountVendor(data).$observable.do((res: any) => {
        // if (account.vendors && _.some(account.vendors, {'id': res.data.vendor.id})){
        let vendorArr = _.map(account.vendors, function(vendor){
          if (vendor['id'] == res.data.vendor.id) {
            return res.data.vendor;
          } else {
            return vendor;
          }
        });
        account.vendors = vendorArr;
        // }
        this.accountService.updateSelfData(account);
      });
    }
  }
}