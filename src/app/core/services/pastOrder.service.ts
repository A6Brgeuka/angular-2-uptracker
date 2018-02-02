import { ModelService } from '../../overrides/model.service';
import { Injectable, Injector } from '@angular/core';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { Restangular } from 'ngx-restangular';
import { APP_CONFIG, AppConfig } from '../../app.config';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Router } from '@angular/router';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class PastOrderService extends ModelService {
  public appConfig: AppConfig;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public filterBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public openListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public receivedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public favoritedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public backorderedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public flaggedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public closedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public router: Router,
    public accountService: AccountService,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
  }
  
  getPastOrders() {
    //GET /pos
    return this.restangular.all('pos').customGET()
    .map((res: any) => {
      this.loadCollection$.next(res.data);
      return res.data;
    });
  }
  
  updateSortBy(param) {
    this.sortBy$.next(param);
  }
  
  updateFilterBy(value) {
    this.filterBy$.next(value);
  }
  
  getPastOrder(id:string) {
    //GET /po/{order_id} - the order_id, not po_number
    return this.restangular.one('po', id).customGET()
    .map((res: any) => res.data);
  }
  
  goToReceive(queryParams) {
    this.router.navigate(['orders/receive', queryParams]);
  }
  
  getOpenedProducts() {
    return this.restangular.one('pos', '5').customGET()
    .map((res: any) => {
      this.openListCollection$.next(res.data);
      return res.data;
    });
  }

  getReceivedProducts() {
    return this.restangular.one('pos', '6').customGET()
    .map((res: any) => {
      this.receivedListCollection$.next(res.data);
      return res.data;
    });
  }

  getFavoritedProducts() {
    return this.restangular.one('pos', 'favorites').customGET()
    .map((res: any) => {
      this.favoritedListCollection$.next(res.data);
      return res.data;
    });
  }

  getBackorderedProducts() {
    return this.restangular.one('pos', '10').customGET()
    .map((res: any) => {
      this.backorderedListCollection$.next(res.data);
      return res.data;
    });
  }

  getFlaggedProducts() {
    return this.restangular.one('pos', 'flagged').customGET()
    .map((res: any) => {
      this.flaggedListCollection$.next(res.data);
      return res.data;
    });
  }

  getClosedProducts() {
    return this.restangular.one('pos', '8').customGET()
    .map((res: any) => {
      this.closedListCollection$.next(res.data);
      return res.data;
    });
  }
  
  setFlag(item, id) {
    return this.restangular.one('pos', id).one('flag').customPUT({'flagged' : !item.flagged})
      .map(res => {
        this.updateElementCollection$.next(res.data);
        return res.data;
      });
  }

  setFavorite(item, id) {

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
          const foundedItem = _.find(voidedOrders, ['id', item.id]);
          if (foundedItem) {
            item = foundedItem;
          }
          return [...acc, item];
        }, []);
      });
    })
    .map(res =>
      this.updateCollection$.next(res)
    );
  }
}
