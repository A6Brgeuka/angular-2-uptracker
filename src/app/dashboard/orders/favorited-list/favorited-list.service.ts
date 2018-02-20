import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as _ from 'lodash';

import { PastOrderService } from '../../../core/services';
import { OrderListBaseService } from '../classes/order-list-base.service';

@Injectable()
export class FavoritedListService extends OrderListBaseService {

  private postItemRequest$: Observable<any>;
  private postItem$: Subject<any> = new Subject();

  constructor(
    private restangular: Restangular,
    private pastOrderService: PastOrderService,
  ) {
    super(pastOrderService.entities$);


    this.postItemRequest$ = this.postItem$
    .switchMap((item) =>
      this.restangular.one('pos', item.order_id).one('favorite', item.id).customPUT({'favorite': !item.favorite})
      .map((res: any) => res.data)
      .catch((error) => Observable.never())
    )
    .share();

    this.pastOrderService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
    this.pastOrderService.addCollectionStreamToEntittesStream(this.postItemRequest$.map(item => [item]));

    const collectionIdsGetRequest$ = this.getCollectionRequest$
    .map((items) => ({type: 'replace', value: _.map(items, 'id')}));

    const collectionUpdateIds$ = this.postItemRequest$
    .map((item) =>
      item.favorite ? {type: 'add', value: item.id} : {type: 'remove', value: item.id});

    this.ids$ = Observable.merge(
      collectionIdsGetRequest$,
      collectionUpdateIds$,
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
    this.ids$.connect();

    this.collection$ = Observable.combineLatest(
      this.pastOrderService.entities$,
      this.ids$,
    )
    .map(([entities, ids]) =>
      ids.map((id) => entities[id])
    );
  }

  getRequest() {
    return this.restangular.one('pos', 'favorites').customGET();
  }

  postItem(item) {
    this.postItem$.next(item);
    return this.postItemRequest$;
  }
}
