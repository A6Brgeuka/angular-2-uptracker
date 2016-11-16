import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { Restangular } from 'ng2-restangular';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { VendorResource } from '../../core/resources/index';
import { VendorModel, AccountVendorModel } from '../../models/index';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class VendorService extends ModelService {
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  combinedVendors$: Observable<any>;
  accountVendors$: Observable<any> = Observable.empty();

  constructor(
      public injector: Injector,
      public vendorResource: VendorResource,
      public userService: UserService,
      public accountService: AccountService,
      public restangular: Restangular
  ) {
    super(injector, vendorResource);

    // combine global vendors observable with account vendors from account observable
    this.combinedVendors$ = Observable
        .combineLatest(
            this.collection$,
            this.userService.selfData$
        )
        // filter for emitting only if user account exists (for logout user updateSelfData)
        .filter(([vendors, user]) => {
          return user.account;
        })
        .map(([vendors, user]) => {
          let accountVendors = user.account.vendors;
          // find and combine vendors
          let commonVendors = _.map(vendors, (globalVendor: any) => {
            globalVendor = new VendorModel(globalVendor);
            _.each(accountVendors, (accountVendor: AccountVendorModel) => {
              if (accountVendor.vendor_id == globalVendor.id){
                globalVendor.account_vendor = accountVendor;
                globalVendor.priority = accountVendor.priority;
              }
            });
            return globalVendor;
          });
          return commonVendors;
        })
        .publishReplay(1).refCount();

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
    
    this.collection$ = this.restangular.all('vendors').customGET('')
        .map((res: any) => {
          return res.data.vendors;
        })
        .do((res: any) => {
          this.updateCollection$.next(res);
        }).publishReplay(1).refCount();
  }

  addSubscribers(){
    this.entity$.subscribe((res) => {
      this.updateSelfData(res);
    });
  }

  updateSelfData(data){
    this.updateSelfData$.next(data);
  }

  getVendors(){
    return  this.collection$;
  }

  getVendor(id){
    return this.restangular.one('vendors', id).get();

    // TODO: remove after testing
    // let data = {
    //   id: id
    // };
    // return this.resource.getVendor(data).$observable;
  }

  searchVendor(query){
    return this.restangular.all('search').getList('vendors', {query: query});

    // TODO: remove after testing
    // let data = {
    //   query: query
    // };
    // return this.resource.searchVendors(data).$observable;
  }

  getAccountVendors(){
    // processing account vendors by vendors.service doesn't work correct for logout
    // TODO: remove after testing
    // return this.accountVendors$.isEmpty().switchMap((isEmpty) => {
    //   if(isEmpty) {
    //     this.accountVendors$ = this.restangular.one('accounts', this.userService.selfData.account_id).customGET('vendors')
    //         .map((res: any) => {
    //           return res.data.vendors;
    //         })
    //         .do((res: any) => {
    //           let account = this.userService.selfData.account;
    //           account.vendors = res;
    //           this.accountService.updateSelfData(account);
    //         });
    //   }
    //   return this.accountVendors$;
    // });



    let vendorsLoaded = this.userService.selfData.account.vendors ? this.userService.selfData.account.vendors.length > -1 : false;
    if (!vendorsLoaded) {
      return this.restangular.one('accounts', this.userService.selfData.account_id).customGET('vendors')
          .map((res: any) => {
            return res.data.vendors;
          })
          .do((res: any) => {
            let account = this.userService.selfData.account;
            account.vendors = res;
            this.accountService.updateSelfData(account);
          });

      // TODO: remove after testing
      // let data: any = {
      //   account_id: this.userService.selfData.account_id
      // };
      // return this.resource.getAccountVendors(data).$observable.do((res: any) => {
      //   let account = this.userService.selfData.account;
      //   account.vendors = res.data.vendors;
      //   this.accountService.updateSelfData(account);
      // });
    } else {
      return this.userService.selfData$.map(res => res.account.vendors);
    }
  }

  addAccountVendor(data){
    let account = this.userService.selfData.account;
    let entity$ = this.restangular
        .one('accounts', data.get('account_id'))
        .all('vendors')
        .post(data);

    // TODO: remove after testing
    // entity$ = this.resource.addAccountVendor(data).$observable;
    // let entity$ = this.httpService.post('http://uptracker-api.herokuapp.com/api/v1/accounts/' + data.get('account_id') + '/vendors', data);

    return entity$
        .map((res: any) => { 
          return res.data.vendor;
        })
        .do((res: any) => {
          account.vendors.push(res);
          this.accountService.updateSelfData(account);
        });
  }

  editAccountVendor(data){ 
    let editVendor = data.get('id');
    let account = this.userService.selfData.account;
    // if no id then add new vendor
    if (!editVendor) {
      return this.addAccountVendor(data);
    } else {
      let entity$ = this.restangular
          .one('accounts', data.get('account_id'))
          .one('vendors', data.get('id'))
          .customPUT(data, undefined, undefined, {'Content-Type': undefined});

      return entity$
          .map((res: any) => {
            return res.data.vendor;
          })
          .do((res: any) => {
            let vendorArr = _.map(account.vendors, function(vendor){
              return vendor['id'] == res.id ? res : vendor;
            });
            account.vendors = vendorArr;
            this.accountService.updateSelfData(account);
          });
    }


    // TODO: Remove after testing restangular
    // return this.resource.editAccountVendor(data).$observable.do((res: any) => {
    //   // if (account.vendors && _.some(account.vendors, {'id': res.data.vendor.id})){
    //   let vendorArr = _.map(account.vendors, function(vendor){
    //     if (vendor['id'] == res.data.vendor.id) {
    //       return res.data.vendor;
    //     } else {
    //       return vendor;
    //     }
    //   });
    //   account.vendors = vendorArr;
    //   // }
    //   this.accountService.updateSelfData(account);
    // });
  }
}