import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";

export class OrderOptions {
    primary_tax:number;
    secondary_tax:number;
    shipping_handling:number;
    ship_to:string;
    order_method:string;
}

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class OrderService extends ModelService {
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
  }

  getOrder(orderId:string) {
    return this.restangular.one('orders',orderId).all('preview').customGET('')
    .map((res: any) => {
          return res.data.map((item:any)=>{
            item.primary_tax_nf/=100;
            item.secondary_tax_nf/=100;
            item.shipping_handling_nf/=100;
            item.sub_total_nf/=100;
            item.total_nf/=100;
            return item;
          });
        })
    .do((res: any) => {
      this.updateCollection$.next(res);
    });
  }
  
  updateOrder(orderId,data:OrderOptions){
    return this.restangular.one('orders',orderId).all('preview').customPUT(data)
    .map((res: any) => {
      return res.data.map((item:any)=>{
        item.primary_tax_nf/=100;
        item.secondary_tax_nf/=100;
        item.shipping_handling_nf/=100;
        item.sub_total_nf/=100;
        item.total_nf/=100;
        return item;
      });
    })
    //update order data
  }
  
}
