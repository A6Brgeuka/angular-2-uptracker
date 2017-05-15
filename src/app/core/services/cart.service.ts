import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";
import { SlFilters } from '../../models/slfilters.model';

export class PriceInfoDiscounts{
  type:string = "";
  amount:number = 0;
  reward_points:number =0; //reward
  bogo_type:string =""; //typeBogo
  discounted:number = 0;
  
  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class PriceInfoData{
  public variant_id:string;
  public price:number;
  public price_type:string;
  public discounts:PriceInfoDiscounts[];
  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
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
  public filters$: BehaviorSubject<SlFilters> = new BehaviorSubject(new SlFilters);
  
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
    this.accountService.dashboardLocation$
    .map((r:any)=>{
      return r ? r.id : null;
    })
    .switchMap((l:any)=>{
      if (l) {
        return this.restangular.one('cart',l).customGET('');
      } else {
        return this.restangular.all('cart').customGET('');
      }
    })
    .map((res: any) => {
        _.map(res.data.items,(r:any)=>{
          if (!r.selected_vendor || !r.selected_vendor.vendor_name) {
            r.selected_vendor = {
              'vendor_name':'Auto'
            };
          }
          r.price/=100;
          r.selected_vendor.price/=100;
          r.selected_vendor.book_price/=100;
          r.selected_vendor.your_price/=100;
          r.vendors.map((v:any)=>{
              v.book_price/=100;
              v.club_price/=100;
              v.your_price/=100;
            });
          r.selected = true;
          r.prev_location = r.location_id;
          return r;
        });
      this.ordersPreview$.next(res.data.order_previews);
      return res.data.items;
    })
    .do((res: any) => {
      this.updateCollection$.next(res);
    })
    .subscribe();
    console.log("order service loaded");
  }
  
  addToCart (data){
    return this.restangular.one('cart',data.location_id).customPOST(data);
  }
  
  updateItem (data) {
    return this.restangular.one('cart',data.location_id).customPUT(data);
  }
  
  removeItem (data) {
    return this.restangular.one('cart',data.location_id).customDELETE(data);
  }
  
  updatePriceInfo(data:any, location_id){
    return this.restangular.one('cart',location_id).all('pricing').customPUT(data);
  }
  
}
