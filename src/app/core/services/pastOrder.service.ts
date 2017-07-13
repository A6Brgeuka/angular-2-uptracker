import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";

export class ConvertData {
  vendor_id: string[];
  location_id: string;
}


@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class PastOrderService extends ModelService {
  public appConfig: AppConfig;
  public itemsVisibility: boolean[];
  
  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);

    this.getPastOrders().subscribe((orders) => {
      this.loadCollection$.next(orders);
      this.itemsVisibility = new Array(orders.length).fill(false);
    });
    
  }
  
  getPastOrders(){
    //GET /pos
    return this.restangular.all('pos').customGET()
    .map((res:any)=>res.data);
  }
  
  getPastOrder(id:string){
    //GET /po/{order_id} - the order_id, not po_number
    return this.restangular.one('po',id).customGET()
    .map((res:any)=>res.data);
  }
  
}
