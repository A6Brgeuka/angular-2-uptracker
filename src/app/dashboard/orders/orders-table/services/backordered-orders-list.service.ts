import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { OrderListBaseService } from '../../classes/order-list-base.service';
import { OrdersTableService } from './orders-table.service';

@Injectable()
export class BackorderedOrdersListService extends OrderListBaseService {

  protected idName = 'order_id';

  constructor(
    private restangular: Restangular,
    private ordersTableService: OrdersTableService,
  ) {
    super(ordersTableService);
    this.ordersTableService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
  }

  getRequest(params) {
    return this.restangular.one('pos', 'backordered').customGET('', params);
  }
}
