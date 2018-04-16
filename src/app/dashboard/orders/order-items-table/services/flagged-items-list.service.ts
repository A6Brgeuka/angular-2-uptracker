import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

import { OrderListBaseService } from '../../classes/order-list-base.service';
import { OrderItemsTableService } from './order-items-table.service';
import { ToasterService } from '../../../../core/services/toaster.service';

@Injectable()
export class FlaggedItemsListService extends OrderListBaseService {

  protected idName = 'id';

  private putItemRequest$: Observable<any>;
  private putItem$: Subject<any> = new Subject();

  constructor(
    private restangular: Restangular,
    private orderItemsTableService: OrderItemsTableService,
    private toasterService: ToasterService,
  ) {
    super(orderItemsTableService);

    this.putItemRequest$ = this.putItem$
    .switchMap((item) => {
      const data = {
        'flagged': true,
        'flagged_comment': item.flagged_comment,
      };
      return this.restangular.one('pos', item.order_id).one('flag', item.id).customPUT(data)
      .map((res: any) => {
        this.toasterService.pop('', res.data.flagged ? 'Flagged' : 'Unflagged');
        return res.data;
      })
      .catch((error) => Observable.never());
    })
    .share();

    this.orderItemsTableService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
    this.orderItemsTableService.addCollectionStreamToEntittesStream(this.putItemRequest$.map(item => [item]));

    const collectionIdsGetRequest$ = this.getCollectionRequest$
    .map((items) => _.map(items, 'id'))
    .let(this.getSetAction);

    const collectionAddIds$ = this.putItemRequest$
    .filter((item) => item.flagged)
    .map((item) => [item.id])
    .let(this.getAddAction);

    const collectionRemoveIds$ = this.putItemRequest$
    .filter((item) => !item.flagged)
    .map((item) => [item.id])
    .let(this.getRemoveAction);

    const collectionVoidedIds$ = this.orderItemsTableService.removeIds$
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
      this.orderItemsTableService.entities$,
      this.ids$,
    )
    .map(([entities, ids]) =>
      ids.map((id) => entities[id])
    );
  }

  getRequest(params) {
    return this.restangular.one('pos', 'flagged').all('items').customGET('', params);
  }

  putItem(item) {
    this.putItem$.next(item);
    return this.putItemRequest$;
  }
}
