import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { OrderListBaseService } from '../../classes/order-list-base.service';
import { OrdersTableService } from './orders-table.service';
import { OrdersService } from '../../orders.service';

@Injectable()
export class ReconciledOrdersListService extends OrderListBaseService {

  protected idName = 'order_id';

  constructor(
    private restangular: Restangular,
    private ordersTableService: OrdersTableService,
    private ordersService: OrdersService,
  ) {
    super(ordersTableService, ordersService);
    this.ordersTableService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
  }

  getRequest(params) {
    return this.restangular.one('pos', 'reconciled').customGET('', params);
  }
}
