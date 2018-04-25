import { Injectable, Injector } from '@angular/core';

import { Restangular } from 'ngx-restangular';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';

export class PriceInfoDiscounts {
  type = 'fixed';
  amount = 5;
  reward_points = 0; //reward
  bogo_type = 'free'; //typeBogo
  discounted = 1;
  total = 1;
  full_price = 4;
  
  constructor(obj?: any) {
    for (const field in obj) {
      if (typeof this[field] !== 'undefined') {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class PriceInfoData {
  public variant_id: string;
  public price: number;
  public price_type: string;
  public discounts: PriceInfoDiscounts[];
  constructor(obj?: any) {
    for (const field in obj) {
      if (typeof this[field] !== 'undefined') {
        this[field] = obj && obj[field];
       }
    }
  }
}

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class CartService extends ModelService {
  public appConfig: AppConfig;
  public ordersPreview$: any = new BehaviorSubject([]);
  public filtersParams$: BehaviorSubject<any> = new BehaviorSubject(null);
  public cartData$: Observable<any>;

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
    this.onInit();
  }

  onInit() {

    this.cartData$ = Observable.combineLatest(
      this.accountService.dashboardLocation$,
      this.filtersParams$,
    )
    .debounceTime(50)
    .publishReplay(1).refCount();

    this.cartData$
    .switchMap(([l, filters]) => {
      if (l) {
        return this.restangular.one('cart', l.id).customGET('', filters);
      } else {
        return this.restangular.all('cart').customGET('', filters);
      }
    })
    .map((res: any) => {
      res.data.items = this.dividePrices(res.data.items);
      this.ordersPreview$.next(res.data.order_previews);
      return res.data.items;
    })
    .do((res: any) => {
      this.updateCollection$.next(res);
    })
    .subscribe();
    console.log('order service loaded');
  }
  
  updateCollection(res: any): void {
    res = this.dividePrices(res);
    this.updateCollection$.next(res);
  }
  
  dividePrices(res: any): any {
    _.map(res, (r: any) => {
      if ((!r.selected_vendor || !r.selected_vendor.vendor_name) && r.vendors.length) {
        r.selected_vendor = r.vendors[0];
        r.price = r.selected_vendor.book_price;
      }
      r.price /= 100;
      r.selected_vendor.price /= 100;
      r.selected_vendor.book_price /= 100;
      r.selected_vendor.your_price /= 100;
      r.vendors.map((v: any) => {
        v.book_price /= 100;
        v.club_price /= 100;
        v.your_price /= 100;
        v.lowest_price /= 100;
      });
      r.vendors.sort((a, b) => {
        if (a.book_price > b.book_price) {
          return 1;
        } else if (a.book_price < b.book_price) {
          return -1;
        } else {
          return 0;
        }
      });
  
      r.selected = true;
      r.prev_location = r.location_id;
      
      return r;
    });
    return res;
  }
  
  addToCart (data) {
    return this.restangular.one('cart', data.location_id).customPOST(data);
  }
  
  updateItem (data) {
    return this.restangular.all('cart').customPUT(data).map(res => res.data);
  }
  
  removeItem (data) {
    return this.restangular.one('cart', data.location_id).customDELETE(data);
  }
  
  updatePriceInfo(data: any, location_id) {
    return this.restangular.one('cart', location_id).all('pricing').customPUT(data);
  }
  
  removeItems(items) {
    const idArray = [];
    items.map((item) => idArray.push(item.id));
    
    const payload = {
      item_ids: idArray.toString()
    };
    return this.restangular.all('cart').customDELETE('', payload).map(res => res.data);
  }
  
}
