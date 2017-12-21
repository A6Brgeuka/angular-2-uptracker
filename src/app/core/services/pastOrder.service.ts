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
  public updateFlaggedElementCollection$: Subject<any> = new Subject<any>();
  
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
    let updateFlaggedElementCollection$ = this.updateFlaggedElementCollection$
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
      updateFlaggedElementCollection$,
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
  
  goToReceive(queryParams) {
    this.router.navigate(['orders/receive', queryParams]);
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
        this.updateFlaggedElementCollection$.next(res.data);
        return res.data;
      });
  }
  
  reorder(data) {
    return this.restangular.all('reorder').customPOST(data);
  }
  
  onVoidOrder(data) {
    return this.restangular.one('pos', 'void').customPOST(data)
    .map(res => res.data)
    .switchMap((voidedOrders: any[]) => {
      return this.collection$.first()
      .map(orders => {
        return orders.reduce((acc: any[], item) => {
          let findedItem = _.find(voidedOrders, ['order_id', item.order_id]);
          if (findedItem) {
            item = findedItem;
          }
          return [...acc, item];
        }, []);
      })
    })
    .map(res => this.updateCollection$.next(res));
  }
}
