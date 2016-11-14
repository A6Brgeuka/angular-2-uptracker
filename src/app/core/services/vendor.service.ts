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
import { HttpClient } from './http.service';
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


  constructor(
      public injector: Injector,
      public vendorResource: VendorResource,
      public httpService: HttpClient,
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




    this.collection$ = this.restangular.all('vendors').customGET('')
        .map((res: any) => { //debugger;
          return res.data.vendors;
        })
        .do((res: any) => {
          this.updateCollection$.next(res);
        });
    return  this.collection$; //.do((res)=>{debugger});








    // this.collection$.do((res)=>{debugger}).subscribe((res)=>{debugger});
    //
    // debugger;
    // return this.collection$
    //     .do((res)=>{debugger})
    //     .isEmpty().switchMap((isEmpty) => { debugger;
    //   if(isEmpty) {
    //     this.collection$ = this.restangular.all('vendors').customGET('')
    //         .map((res: any) => { debugger;
    //           return res.data.vendors;
    //         })
    //         .do((res: any) => {
    //           this.updateCollection$.next(res);
    //         });
    //   }
    //   return this.collection$.do((res)=>{debugger});
    // });

    // TODO: remove after testing
    // return this.resource.getVendors().$observable
    //     .map((res: any) => {
    //       return res.data.vendors;
    //     })
    //     .do((res: any) => {
    //       this.updateCollection$.next(res);
    //     });
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
    let vendorsLoaded = this.userService.selfData.account.vendors ? this.userService.selfData.account.vendors.length : false;
    if (!vendorsLoaded) {
      let entity$ = this.restangular.one('accounts', this.userService.selfData.account_id).customGET('vendors');
      return entity$
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
    }
  }

  addAccountVendor(data){
    let account = this.userService.selfData.account;
    let entity$ = this.restangular
        .one('accounts', data.get('account_id'))
        .all('vendors')
        .customPOST(data, undefined, undefined, { 'Content-Type': undefined });

    // TODO: remove after testing
    // entity$ = this.resource.addAccountVendor(data).$observable;
    // let entity$ = this.httpService.post('http://uptracker-api.herokuapp.com/api/v1/accounts/' + data.get('account_id') + '/vendors', data);


    return entity$
        .map((res: any) => { debugger;
          return res.data.vendor;
          // return res._body.data.vendor;
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
    } else { debugger;
      let entity$ = this.restangular
          .one('accounts', data.get('account_id'))
          .one('vendors', data.get('id'))
          .customPUT(data, undefined, undefined, { 'Content-Type': undefined });
      return entity$
          .map((res: any) => {
            console.log(111, res.data.vendor); debugger;
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