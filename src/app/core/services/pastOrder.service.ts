import { ModelService } from '../../overrides/model.service';
import { Injectable, Injector } from '@angular/core';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { Restangular } from 'ngx-restangular';
import { APP_CONFIG, AppConfig } from '../../app.config';
import { BehaviorSubject, ConnectableObservable } from 'rxjs';
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

  public entities$: Observable<{[id: string]: any}>;

  public appConfig: AppConfig;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public filterBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public allCollectionGetRequest$: Observable<any>;
  public openCollectionGetRequest$: Observable<any>;
  public receivedCollectionGetRequest$: Observable<any>;
  public favoritedCollectionGetRequest$: Observable<any>;
  public backorderedCollectionGetRequest$: Observable<any>;
  public flaggedCollectionGetRequest$: Observable<any>;
  public closedCollectionGetRequest$: Observable<any>;

  public allCollectionGet$: Subject<any> = new Subject();
  public openCollectionGet$: Subject<any> = new Subject();
  public receivedCollectionGet$: Subject<any> = new Subject();
  public favoritedCollectionGet$: Subject<any> = new Subject();
  public backorderedCollectionGet$: Subject<any> = new Subject();
  public flaggedCollectionGet$: Subject<any> = new Subject();
  public closedCollectionGet$: Subject<any> = new Subject();

  public allListCollection$: Observable<any>;
  public openListCollection$: Observable<any>;
  public receivedListCollection$: Observable<any>;
  public favoritedListCollection$: Observable<any>;
  public backorderedListCollection$: Observable<any>;
  public flaggedListCollection$: Observable<any>;
  public closedListCollection$: Observable<any>;

  public allCollectionIds$: ConnectableObservable<any>;
  public openCollectionIds$: ConnectableObservable<any>;
  public receivedCollectionIds$: ConnectableObservable<any>;
  public favoritedCollectionIds$: ConnectableObservable<any>;
  public backorderedCollectionIds$: ConnectableObservable<any>;
  public flaggedCollectionIds$: ConnectableObservable<any>;
  public closedCollectionIds$: ConnectableObservable<any>;

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public router: Router,
    public accountService: AccountService,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);

    this.allCollectionGetRequest$ = this.allCollectionGet$
    .switchMap(() =>
      this.restangular.all('pos').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.allCollectionIds$ = this.allCollectionGetRequest$
    .map((items) => _.map(items, 'id'))
    .publishBehavior([]);
    this.allCollectionIds$.connect();

    this.openCollectionGetRequest$ = this.openCollectionGet$
    .switchMap(() =>
    this.restangular.one('pos', '5').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.openCollectionIds$ = this.openCollectionGetRequest$
    .map((items) => _.map(items, 'id'))
    .publishBehavior([]);
    this.openCollectionIds$.connect();

    this.receivedCollectionGetRequest$ = this.receivedCollectionGet$
    .switchMap(() =>
      this.restangular.one('pos', '6').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.receivedCollectionIds$ = this.receivedCollectionGetRequest$
    .map((items) => _.map(items, 'id'))
    .publishBehavior([]);
    this.receivedCollectionIds$.connect();

    this.favoritedCollectionGetRequest$ = this.favoritedCollectionGet$
    .switchMap(() =>
      this.restangular.one('pos', 'favorites').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.favoritedCollectionIds$ = this.favoritedCollectionGetRequest$
    .map((items) => _.map(items, 'id'))
    .publishBehavior([]);
    this.favoritedCollectionIds$.connect();

    this.backorderedCollectionGetRequest$ = this.backorderedCollectionGet$
    .switchMap(() =>
      this.restangular.one('pos', '10').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.backorderedCollectionIds$ = this.backorderedCollectionGetRequest$
    .map((items) => _.map(items, 'id'))
    .publishBehavior([]);
    this.backorderedCollectionIds$.connect();

    this.flaggedCollectionGetRequest$ = this.flaggedCollectionGet$
    .switchMap(() =>
      this.restangular.one('pos', 'flagged').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.flaggedCollectionIds$ = this.flaggedCollectionGetRequest$
    .map((items) => _.map(items, 'id'))
    .publishBehavior([]);
    this.flaggedCollectionIds$.connect();

    this.closedCollectionGetRequest$ = this.closedCollectionGet$
    .switchMap(() =>
      this.restangular.one('pos', '8').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.closedCollectionIds$ = this.closedCollectionGetRequest$
    .map((items) => _.map(items, 'id'))
    .publishBehavior([]);
    this.closedCollectionIds$.connect();

    this.entities$ = Observable.merge(
      this.allCollectionGetRequest$,
      this.openCollectionGetRequest$,
      this.receivedCollectionGetRequest$,
      this.favoritedCollectionGetRequest$,
      this.backorderedCollectionGetRequest$,
      this.flaggedCollectionGetRequest$,
      this.closedCollectionGetRequest$,
    )
    .scan((acc, items: any[]) => {
      const newEntities = items.reduce((itemEntities, item) => {
        const oldEntity = acc[item.id];
        const entityToSet = oldEntity ? {...oldEntity, ...item} : item;
        return {
          ...itemEntities,
          [item.id]: entityToSet,
        };
      }, {});

      return {...acc, ...newEntities};
    }, {})

    this.allListCollection$ = Observable.combineLatest(
      this.entities$,
      this.allCollectionIds$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));

    this.openListCollection$ = Observable.combineLatest(
      this.entities$,
      this.openCollectionIds$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));

    this.receivedListCollection$ = Observable.combineLatest(
      this.entities$,
      this.receivedCollectionIds$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));

    this.favoritedListCollection$ = Observable.combineLatest(
      this.entities$,
      this.favoritedCollectionIds$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));

    this.backorderedListCollection$ = Observable.combineLatest(
      this.entities$,
      this.backorderedCollectionIds$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));

    this.flaggedListCollection$ = Observable.combineLatest(
      this.entities$,
      this.flaggedCollectionIds$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));

    this.closedListCollection$ = Observable.combineLatest(
      this.entities$,
      this.closedCollectionIds$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));

  }

  getPastOrders() {
    this.allCollectionGet$.next(null);
    return this.allCollectionGetRequest$;
  }
  
  getOpenedProducts() {
    this.openCollectionGet$.next(null);
    return this.openCollectionGetRequest$;
  }

  getReceivedProducts() {
    this.receivedCollectionGet$.next(null);
    return this.receivedCollectionGetRequest$;
  }

  getFavoritedProducts() {
    this.favoritedCollectionGet$.next(null);
    return this.favoritedCollectionGetRequest$;
  }

  getBackorderedProducts() {
    this.backorderedCollectionGet$.next(null);
    return this.backorderedCollectionGetRequest$;
  }

  getFlaggedProducts() {
    this.flaggedCollectionGet$.next(null);
    return this.flaggedCollectionGetRequest$;
  }

  getClosedProducts() {
    this.closedCollectionGet$.next(null);
    return this.closedCollectionGetRequest$;
  }

  setFlag(item, id) {
    const data = {
      'flagged' : !item.flagged,
      'flagged_comment' : !item.flagged ? item.flagged_comment : '',
    };
    return this.restangular.one('pos', item.order_id).one('flag', id).customPUT(data)
      .map(res => {
        this.updateElementCollection$.next(res.data);
        // this.updateFlaggedFavoriteElementCollection$.next(res.data);
        return res.data;
      });
  }

  setFavorite(item, id) {
    return this.restangular.one('pos', item.order_id).one('favorite', id).customPUT({'favorite': !item.favorite})
    .map(res => {
      // this.allCollectionGet$.next(null);
      // this.updateFlaggedFavoriteElementCollection$.next(res.data);
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

}
