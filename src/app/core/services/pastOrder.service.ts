import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { APP_CONFIG, AppConfig } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { UserService } from "./user.service";
import { AccountService } from "./account.service";
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

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
  public itemsVisibilityReceivedList: boolean[];
  public statusList: any[] = [];
  public updateElementCollectionAfterVoidReq$:Subject<any> = new Subject<any>();
  
  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public router: Router,
    public accountService: AccountService,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
    this.updateCollection();
  }
  
  updateCollection() {
    let updateElementCollection$ = this.updateElementCollection$
    .switchMap((entity) => {
      return this.collection$.first()
      .map((collection: any) => {
        return collection.map((el: any) => {
          if (el.order_id == entity.order_id) {
            el.flagged = entity.flagged;
          }
          return el;
        });
      });
    });
    
    this.collection$ = Observable.merge(
      this.loadCollection$,
      this.updateCollection$,
      updateElementCollection$,
    ).publishReplay(1).refCount();
    this.collection$.subscribe(res => {
      this.collection = res;
      console.log(`${this.constructor.name} Collection Updated`, res);
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
  
  getStatusList() {
    return this.restangular.one('config', 'order_receiving_status').customGET('')
    .map(res => this.statusList = res.data);
  }
  
  goToReceive(queryParams) {
    this.router.navigate(['orders/receive', queryParams]);
  }
  
  getReceiveProduct(queryParams) {
    let params: any[] = queryParams.split('&');
    let orderIds = params[0];
    let itemsIds = params[1];
    
    if(itemsIds) {
      return this.restangular.all('receive').customGET('', {'order_ids': orderIds, 'items_ids' : itemsIds})
      .map(res => res.data)
    } else {
      return this.restangular.all('receive').customGET('', { 'item_ids' : queryParams })
      .map(res => res.data)
    }
    
  }
  
  onReceiveProducts(productsToReceive) {
    return this.restangular.all('receive').customPOST(productsToReceive);
  }
  
  getProductFields(variantId) {
    return this.restangular.one('inventory', 'search').customGET('', {'variant_id' : variantId})
    .map(res => res.data.results[0]);
  }
  
  getReceivedProducts() {
    return this.restangular.one('pos', '6').customGET()
    .map((res:any)=>res.data);
  }
  
  getOpenedProducts() {
    return this.restangular.one('pos', '5').customGET()
    .map((res:any)=>res.data);
  }
  
  setFlag(order) {
    return this.restangular.one('pos', order.order_id).one('flag').customPUT({'flagged' : !order.flagged})
      .map(res => {
        this.updateElementCollection$.next(res.data);
        return res.data;
      });
  }
  
  reorder(data) {
    return this.restangular.all('reorder').customPOST(data);
  }
  
  onVoidOrder(data) {
    return this.restangular.one('pos', 'void').customPOST(data)
      .map(res => res.data);
  }
}
