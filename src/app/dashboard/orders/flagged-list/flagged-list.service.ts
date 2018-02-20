import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { PastOrderService } from '../../../core/services';
import { OrderListBaseService } from '../classes/order-list-base.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

@Injectable()
export class FlaggedListService extends OrderListBaseService {

  private putItemRequest$: Observable<any>;
  private putItem$: Subject<any> = new Subject();

  constructor(
    private restangular: Restangular,
    private pastOrderService: PastOrderService,
  ) {
    super(pastOrderService.entities$);

    this.putItemRequest$ = this.putItem$
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

    this.pastOrderService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
    this.pastOrderService.addCollectionStreamToEntittesStream(this.putItemRequest$.map(item => [item]));

    const collectionIdsGetRequest$ = this.getCollectionRequest$
    .map((items) => ({type: 'replace', value: _.map(items, 'id')}));

    const collectionUpdateIds$ = this.putItemRequest$
    .map((item) =>
      item.flagged ? {type: 'add', value: item.id} : {type: 'remove', value: item.id});

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
    return this.restangular.one('pos', 'flagged').customGET();
  }

  putItem(item) {
    this.putItem$.next(item);
    return this.putItemRequest$;
  }
}
