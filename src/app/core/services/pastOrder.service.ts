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
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class PastOrderService extends ModelService {
  public appConfig: AppConfig;
  public updateFlaggedElementCollection$: Subject<any> = new Subject<any>();
  public updateFavoriteElementCollection$: Subject<any> = new Subject<any>();
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public filterBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public openListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public receivedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public favoritedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public backorderedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public flaggedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public closedListCollection$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  receivedCollection$: Observable<any> = new Observable<any>();

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public router: Router,
    public accountService: AccountService,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
    this.updateFlaggedCollection();
  }

  updateFlaggedCollection() {
    const updateFlaggedElementCollection$ = this.updateFlaggedElementCollection$
    .switchMap((entity) => {
      return this.collection$.first()
      .map((collection: any) => {
        return collection.map((el: any) => {
          if (el.id === entity.id) {
            el.flagged_comment = entity.flagged_comment;
            el.flagged = entity.flagged;
            el.favorite = entity.favorite;
          }
          return el;
        });
      });
    });


    this.collection$ = Observable.merge(
      this.loadCollection$,
      updateFlaggedElementCollection$,
    ).publishReplay(1).refCount();
    this.collection$.subscribe(res => {
      this.collection = res;
    });


    // this.receivedCollection$ = Observable.merge(
    //   this.receivedListCollection$,
    //   updateFlaggedElementCollection$,
    // ).publishReplay(1).refCount();
    // this.receivedCollection$.subscribe(res => {
    //   // this.collection = res;
    // });

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
    const data = {
      'flagged' : !item.flagged,
      'flagged_comment' : !item.flagged ? item.flagged_comment : '',
    };
    return this.restangular.one('pos', item.order_id).one('flag', id).customPUT(data)
      .map(res => {
        // this.updateElementCollection$.next(res.data);
        this.updateFlaggedElementCollection$.next(res.data);
        return res.data;
      });
  }

  setFavorite(item, id) {
    return this.restangular.one('pos', item.order_id).one('favorite', id).customPUT({'favorite': !item.favorite})
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
