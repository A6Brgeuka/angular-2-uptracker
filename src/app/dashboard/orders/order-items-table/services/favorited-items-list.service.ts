import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as _ from 'lodash';

import { OrderListBaseService } from '../../classes/order-list-base.service';
import { OrderItemsTableService } from './order-items-table.service';
import { ToasterService } from '../../../../core/services/toaster.service';

@Injectable()
export class FavoritedItemsListService extends OrderListBaseService {

  protected idName = 'id';

  private postItemRequest$: Observable<any>;
  private postItem$: Subject<any> = new Subject();

  constructor(
    private restangular: Restangular,
    private orderItemsTableService: OrderItemsTableService,
    private toasterService: ToasterService,
  ) {
    super(orderItemsTableService);

    this.postItemRequest$ = this.postItem$
    .switchMap((item) =>
      this.restangular.one('pos', item.order_id).one('favorite', item.id).customPUT({'favorite': !item.favorite})
      .map((res: any) => {
        this.toasterService.pop('', res.data.favorite ? 'Favorite' : 'Unfavorite');
        return res.data;
      })
      .catch((error) => Observable.never())
    )
    .share();

    this.orderItemsTableService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
    this.orderItemsTableService.addCollectionStreamToEntittesStream(this.postItemRequest$.map(item => [item]));

    const collectionIdsGetRequest$ = this.getCollectionRequest$
    .map((items) => _.map(items, 'id'))
    .let(this.getSetAction);

    const collectionAddIds$ = this.postItemRequest$
    .filter((item) => item.favorite)
    .map((item) => [item.id])
    .let(this.getAddAction);

    const collectionRemoveIds$ = this.postItemRequest$
    .filter((item) => !item.favorite)
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
    return this.restangular.one('pos', 'favorites').all('items').customGET('', params);
  }

  postItem(item) {
    this.postItem$.next(item);
    return this.postItemRequest$;
  }
}
