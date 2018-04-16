import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

import { OrderListBaseService } from '../../classes/order-list-base.service';
import { OrdersTableService } from './orders-table.service';

@Injectable()
export class FlaggedOrdersListService extends OrderListBaseService {

  protected idName = 'order_id';

  private putItemRequest$: Observable<any>;
  private putItem$: Subject<any> = new Subject();

  constructor(
    private restangular: Restangular,
    private ordersTableService: OrdersTableService,
  ) {
    super(ordersTableService);

    this.putItemRequest$ = this.putItem$
    .switchMap((item) => {
      const data = {
        'flagged': true,
        'flagged_comment': item.flagged_comment,
      };
      return this.restangular.one('pos', item.order_id).one('flag', item.id).customPUT(data)
      .map((res: any) => res.data)
      .catch((error) => Observable.never());
    })
    .share();

    this.ordersTableService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
    this.ordersTableService.addCollectionStreamToEntittesStream(this.putItemRequest$.map(item => [item]));

    const collectionIdsGetRequest$ = this.getCollectionRequest$
    .map((items) => _.map(items, this.idName))
    .let(this.getSetAction);

    const collectionAddIds$ = this.putItemRequest$
    .filter((item) => item.flagged)
    .map((item) => [item[this.idName]])
    .let(this.getAddAction);

    const collectionRemoveIds$ = this.putItemRequest$
    .filter((item) => !item.flagged)
    .map((item) => [item[this.idName]])
    .let(this.getRemoveAction);

    const collectionVoidedIds$ = this.ordersTableService.removeIds$
    .let(this.getRemoveAction);

    this.ids$ = Observable.merge(
      collectionIdsGetRequest$,
      collectionAddIds$,
      collectionRemoveIds$,
      collectionVoidedIds$,
    )
    .scan(this.reducer, [])
    .publish();
    this.ids$.connect();

    this.collection$ = Observable.combineLatest(
      this.ordersTableService.entities$,
      this.ids$,
    )
    .map(([entities, ids]) =>
      ids.map((id) => entities[id])
    );
  }

  getRequest(params) {
    return this.restangular.one('pos', 'flagged').customGET('', params);
  }

  putItem(item) {
    this.putItem$.next(item);
    return this.putItemRequest$;
  }
}
