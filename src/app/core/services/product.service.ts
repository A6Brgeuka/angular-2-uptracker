import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
import { Restangular } from 'ngx-restangular';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { BehaviorSubject } from 'rxjs';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class ProductService extends ModelService {
  
  public isGrid: boolean = false;
  public selfData: any;
  public selfData$: Observable<any>;
  public updateSelfData$: Subject<any> = new Subject<any>();
  public current_page: number = 1;
  public pagination_limit: number = 10;
  public combinedProducts$: Observable<any>;
  public isDataLoaded$: any = new BehaviorSubject(false);
  public totalCount$: any = new BehaviorSubject(1);
  public location$: any = new BehaviorSubject(false);
  public getProductsData$: any = new Subject();
  public location: string;
  public total: number = 1;
  public dashboardLocation: any;
  
  constructor(
    public injector: Injector,
    public userService: UserService,
    public accountService: AccountService,
    public restangular: Restangular
  ) {
    super(restangular);
    
    this.combinedProducts$ = Observable
    .combineLatest(
      this.collection$,
      this.userService.selfData$
    )
    .filter(([vendors, user]) => {
      return user.account;
    })
    .publishReplay(1).refCount();
    
    this.onInit();
  }
  
  onInit() {
    this.getProductsData$
    .withLatestFrom(this.location$)
    .map(([queryParams, location]) => {
      if (location) {
        queryParams.query.location_id = location.id;
      }
      return queryParams;
    })
    .switchMap((queryParams) => {
      return this.restangular.all('products').customGET('', queryParams.query)
    })
    
    .subscribe((res) => {
        if (res.data.results.length > 0) {
          this.addCollectionToCollection$.next(res.data.results);
        }
        this.totalCount$.next(res.data.count);
        this.isDataLoaded$.next(true);
        return res.data.results;
      }
    );
    this.selfData$ = Observable.merge(
      this.updateSelfData$
    );
    this.selfData$.subscribe((res) => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);
    });
    
    this.accountService.dashboardLocation$
    .switchMap(location => {
      if (!location) {
        location = {};
      }
      this.dashboardLocation = location;
      this.location$.next(location);
      this.location = location;
      
      return this.getProductsLocation(location.id)
    })
    .subscribe();
  }
  
  
  getNextProducts(page?, search_string?, sortBy?) {
    if (page == 0) {
      this.loadCollection$.next([]);
      this.current_page = 1;
    }
    let query: any = {
      page: this.current_page,
      limit: this.pagination_limit,
    };
    if (search_string) {
      // replace forbidden characters
      query.query = search_string.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }
    if (sortBy && sortBy == 'Z-A') {
      query.sort = 'desc';
    }
    
    return this.getProductsData(query, page ? false : true);
  }
  
  public getProductsData(query: any = {}, reset: boolean = true) {
    this.getProductsData$.next({query, reset});
    return this.getProductsData$.delay(500);
  }
  
  addSubscribers() {
    this.entity$.subscribe((res) => {
      this.updateSelfData(res);
    });
  }
  
  updateSelfData(data) {
    this.updateSelfData$.next(data);
  }
  
  //only for resolver. it works anyway through constructor
  getProducts() {
    return Observable.of([]);
  }
  
  getProductsLocation(id) {
    return this.restangular.all('products').customGET('', {
      location_id: id,
      limit: this.pagination_limit
    })
    .map((res: any) => {
      this.totalCount$.next(res.data.count);
      return res.data.results;
    }).do(res => {
      this.updateCollection$.next(res);
    });
  }
  
  getProduct(id) {
    return this.restangular.one('products', id).get();
  }
  
  getBulkEditAdditionalInfo(ids: string[]) {
    return this.restangular.all('products').all('bulk')
    .customPOST(JSON.stringify({"product_ids": ids}), undefined, undefined, {'Content-Type': "application/json"});
  }
  
  getProductLocation(id, location_id) {
    return this.restangular.one('products', id).get({location_id: location_id});
  }
  
  addProductComment(comment) {
    return this.restangular.all('comments').post(comment)
  }
  
  deleteProductComment(id) {
    return this.restangular.one('comments', id).remove()
  }
  
  editProductComment(comment) {
    let commentRestangularized = this.restangular.restangularizeElement(null, comment, "comments");
    return commentRestangularized.put()
  }
  
  updateProduct(data: any) {
    console.log(data);
    return this.restangular.one('accounts', this.userService.selfData.account_id).all('products').post(data);
  }
  
  bulkUpdateProducts(data: any) {
    return this.restangular.one('accounts', this.userService.selfData.account_id).all('products').all('bulk').post(data);
  }
  
  deepDiff(obj1: any, obj2: any): any {
    if (_.isFunction(obj1) || _.isFunction(obj2)) {
      throw 'Invalid argument. Function given, object expected.';
    }
    if (this.isValue(obj1) || this.isValue(obj2)) {
      if (obj1 != obj2) {
        return obj1;
      } else {
        return 'unmdf';
      }
    }
    let diff: any;
    if (_.isArray(obj1)) {
      diff = [];
    } else {
      diff = {};
    }
    let cnt = 0;
    for (let key in obj1) {
      if (_.isFunction(obj1[key])) {
        continue;
      }
      let value2 = undefined;
      if ('undefined' != typeof(obj2[key])) {
        value2 = obj2[key];
      }
      let val = this.deepDiff(obj1[key], value2);
      if (val != "unmdf" && (!_.isEmpty(val) || this.isValue(val)) && key != 'detailView') {
        if (_.isArray(obj1)) {
          diff.push(val);
        } else {
          diff[key] = val;
        }
        cnt++;
      }
    }
    if (cnt != 0 && obj1.id) {
      diff['id'] = obj1.id;
    }
    return diff;
  };
  
  isValue(obj) {
    return !_.isObject(obj) && !_.isArray(obj);
  }
  
  emptyValues(obj: any): any {
    if (obj === false || this.isValue(obj)) {
      return true;
    }
    if (_.isEmpty(obj)) {
      return false;
    }
    for (let i in obj) {
      if (this.emptyValues(obj[i])) {
        return true
      }
      ;
    }
    return false;
  }
  
}