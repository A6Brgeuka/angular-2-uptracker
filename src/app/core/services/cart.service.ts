import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class CartService extends ModelService {
  public appConfig: AppConfig;
  public ordersPreview$: any = new BehaviorSubject([]);
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
          r.selected = true;
          r.prev_location = r.location_id;
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
  
  
}
