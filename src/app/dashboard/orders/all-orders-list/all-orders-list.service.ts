import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { PastOrderService } from '../../../core/services';

@Injectable()
export class AllOrdersListService {

  public allCollectionGetRequest$: Observable<any>;
  public allCollectionGet$: Subject<any> = new Subject();
  public allListCollection$: Observable<any>;
  public allCollectionIds$: ConnectableObservable<any>;

  constructor(
    private restangular: Restangular,
    private pastOrderService: PastOrderService,
  ) {

    this.allCollectionGetRequest$ = this.allCollectionGet$
    .switchMap(() =>
      this.restangular.all('pos').customGET()
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.pastOrderService.addCollectionStreamToEntittesStream(this.allCollectionGetRequest$);

    this.allCollectionIds$ = this.allCollectionGetRequest$
    .map((items) => items.map(item => item.id))
    .publishBehavior([]);
    this.allCollectionIds$.connect();

    this.allListCollection$ = Observable.combineLatest(
      this.pastOrderService.entities$,
      this.allCollectionIds$,
    )
    .map(([entities, ids]) => ids.map((id) => entities[id]));
  }

  getPastOrders() {
    this.allCollectionGet$.next(null);
    return this.allCollectionGetRequest$;
  }
}
