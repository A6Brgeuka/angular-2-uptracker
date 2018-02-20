import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { Restangular } from 'ngx-restangular';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

import * as _ from 'lodash';

import { APP_CONFIG, AppConfig } from '../../app.config';
import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';

@Injectable()
export class PastOrderService extends ModelService {

  public entities$: ConnectableObservable<{ [id: string]: any }>;

  public appConfig: AppConfig;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public filterBy$: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  public openCollectionGetRequest$: Observable<any>;
  public receivedCollectionGetRequest$: Observable<any>;
  public favoritedCollectionGetRequest$: Observable<any>;
  public flaggedCollectionGetRequest$: Observable<any>;
  public flaggedCollectionPutRequest$: Observable<any>;

  public openCollectionGet$: Subject<any> = new Subject();
  public receivedCollectionGet$: Subject<any> = new Subject();
  public favoritedCollectionGet$: Subject<any> = new Subject();
  public flaggedCollectionGet$: Subject<any> = new Subject();
  public flaggedCollectionPut$: Subject<any> = new Subject();

  public openListCollection$: Observable<any>;
  public receivedListCollection$: Observable<any>;
  public flaggedListCollection$: Observable<any>;

  public openCollectionIds$: ConnectableObservable<any>;
  public receivedCollectionIds$: ConnectableObservable<any>;
  public flaggedCollectionIds$: ConnectableObservable<any>;
  private addCollectionToEntittesStream$: Subject<Observable<any>> = new Subject();

  constructor(
    public injector: Injector,
    public restangular: Restangular,
    public userService: UserService,
    public router: Router,
    public accountService: AccountService,
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);

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

    this.flaggedCollectionGetRequest$ = this.flaggedCollectionGet$
    .switchMap(() =>
      this.restangular.one('pos', 'flagged').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.flaggedCollectionPutRequest$ = this.flaggedCollectionPut$
    .switchMap((item) => {
      const data = {
        'flagged': !item.flagged,
        'flagged_comment': !item.flagged ? item.flagged_comment : '',
      };
      return this.restangular.one('pos', item.order_id).one('flag', item.id).customPUT(data)
      .map((res: any) => res.data)
      .catch((error) => Observable.never());
    })
    .share();

    const flaggedCollectionIdsGetRequest$ = this.flaggedCollectionGetRequest$
    .map((items) => ({type: 'replace', value: _.map(items, 'id')}));

    const flaggedCollectionUpdateIds$ = this.flaggedCollectionPutRequest$
    .map((item) =>
      item.flagged ? {type: 'add', value: item.id} : {type: 'remove', value: item.id});

    this.flaggedCollectionIds$ = Observable.merge(
      flaggedCollectionIdsGetRequest$,
      flaggedCollectionUpdateIds$
    )
    .scan((ids: string[], event: any) => {
      switch (event.type) {
        case 'replace': {
          return event.value;
        }
        case 'add': {
          return _.union(ids, [event.value]);
        }
        case 'remove': {
          return _.without(ids, event.value);
        }
        default: {
          return ids;
        }
      }
    }, [])
    .publish();

    this.flaggedCollectionIds$.connect();

    this.entities$ = this.addCollectionToEntittesStream$
    .mergeAll()
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
    .publishReplay(1);
    this.entities$.connect();

    this.addCollectionStreamToEntittesStream(this.openCollectionGetRequest$);
    this.addCollectionStreamToEntittesStream(this.receivedCollectionGetRequest$);
    this.addCollectionStreamToEntittesStream(this.flaggedCollectionGetRequest$);
    this.addCollectionStreamToEntittesStream(this.flaggedCollectionPutRequest$.map((item: any) => [item]));

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

    this.flaggedListCollection$ = Observable.combineLatest(
      this.entities$,
      this.flaggedCollectionIds$,
    )
    .map(([entities, ids]) =>
      ids.map((id) => entities[id])
    );

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

  getFlaggedProducts() {
    this.flaggedCollectionGet$.next(null);
    return this.flaggedCollectionGetRequest$;
  }

  setFlag(item, id) {
    this.flaggedCollectionPut$.next(item);
    return this.flaggedCollectionPutRequest$;
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

  getPastOrder(id: string) {
    //GET /po/{order_id} - the order_id, not po_number
    return this.restangular.one('po', id).customGET()
    .map((res: any) => res.data);
  }

  goToReceive(queryParams) {
    this.router.navigate(['orders/receive', queryParams]);
  }

  /**
   * Used to add stream as source for entities
   * @param {Observable<any>} stream$
   */
  public addCollectionStreamToEntittesStream(stream$: Observable<any>) {
    this.addCollectionToEntittesStream$.next(stream$);
  }

}
