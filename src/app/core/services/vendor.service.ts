import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { Restangular } from 'ngx-restangular';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { VendorModel, AccountVendorModel } from '../../models/index';
import { BehaviorSubject } from "rxjs";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class VendorService extends ModelService {
  pagination_limit: number = 10;
  total: number = 0;
  current_page: number = 1;
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  totalCount$: Subject<any> = new Subject<any>();
  combinedVendors$: Observable<any>;
  accountVendors$: Observable<any> = Observable.empty();
  vendors$: Observable<any> = Observable.empty();
  public isDataLoaded$: any = new BehaviorSubject(false);
  public selectedTab:any = null;
  
  constructor(
    public injector: Injector,
    public userService: UserService,
    public accountService: AccountService,
    public restangular: Restangular
  ) {
    super(restangular);
    
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
          if (accountVendor.vendor_id == globalVendor.id) {
            // globalVendor.account_vendor = accountVendor;
            globalVendor.account_vendor.push(accountVendor);
            if (!accountVendor.location_id)
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
  
  onInit() {
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
  
  addSubscribers() {
    this.entity$.subscribe((res) => {
      this.updateSelfData(res);
    });
  }
  
  updateSelfData(data) {
    this.updateSelfData$.next(data);
  }
  
  public cleanSearch(ins: string) {
    return ins.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  }
  
  public getVendorsData(query: any = {}, reset: boolean = true) {
    return this.restangular.all('vendors').customGET('', query)
    .map((res: any) => {
        console.log('vnd', res.data.vendors);
        if (reset) {
          this.updateCollection$.next(res.data.vendors);
        } else {
          this.addCollectionToCollection$.next(res.data.vendors);
        }
        this.totalCount$.next(res.data.count);
        this.total = res.data.count;
        this.isDataLoaded$.next(true);
        // this.updateCollection$.next(res.data.vendors);
        return res.data.vendors;
      }
    ).catch(r => console.error(r));
  }
  
  getVendors() {
    //
    //let query: any = {
    //  page: 1,
    //  limit: this.pagination_limit,
    //};
    //return this.vendors$.isEmpty().switchMap((isEmpty) => {
    //  if (isEmpty) {
    //    this.vendors$ = this.getVendorsData(query, true);
    //  }
    //});
    return this.vendors$;
  }
  
  getNextVendors(page?, search_string?, sortBy?) {
    search_string = search_string ? this.cleanSearch(search_string) : '';
    if (!page) {
      this.current_page = 1;
    }
    let query: any = {
      page: this.current_page,
      limit: this.pagination_limit,
    };
    if (search_string) {
      query.query = search_string;
    }
    if (sortBy && sortBy == 'Z-A') {
      query.sort = 'desc';
    }
    return this.getVendorsData(query, page ? false : true);
  }
  
  getVendor(id) {
    return this.restangular.one('vendors', id).get();
  }
  
  getAccountVendor(id) {
    return this.getAccountVendors()
    .map((vnd:any)=>vnd.filter((v:any)=>v.id==id))
  }
  
  searchVendor(query) {
    return this.restangular.all('search').getList('vendors', {query: query});
  }
  
  getAccountVendors() {
    //return this.vendors$;

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
    } else {
      return this.userService.selfData$.map(res => res.account.vendors);
    }
  }
  
  addAccountVendor(data) {
    let account = this.userService.selfData.account;
    let entity$ = this.restangular
    .one('accounts', account.id)
    .all('vendors')
    // .allUrl('post', 'http://api.pacific-grid.2muchcoffee.com/v1/deployments/test-post')
    .post(data);
    
    // TODO: remove after testing
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
  
  editAccountVendor(vendorInfo: any, data) {
    let account = this.userService.selfData.account;
    // if no id then add new vendor
    if (!vendorInfo.id) {
      
      return this.addAccountVendor(data);
    } else {
      
      let entity$ = this.restangular
      .one('accounts', vendorInfo.account_id)
      .one('vendors', vendorInfo.id)
      .customPUT(data, undefined, undefined, {'Content-Type': undefined});
      
      return entity$
      .map((res: any) => {
        return res.data.vendor;
      })
      .do((res: any) => {
        let vendorArr = _.map(account.vendors, function (vendor) {
          return vendor['id'] == res.id ? res : vendor;
        });
        account.vendors = vendorArr;
        this.accountService.updateSelfData(account);
      });
    }
  }
}