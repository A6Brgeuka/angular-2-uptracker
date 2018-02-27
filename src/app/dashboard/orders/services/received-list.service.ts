import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { PastOrderService } from '../../../core/services/index';
import { OrderListBaseService } from '../classes/order-list-base.service';

@Injectable()
export class ReceivedListService extends OrderListBaseService {

  constructor(
    private restangular: Restangular,
    private pastOrderService: PastOrderService,
  ) {
    super(pastOrderService.entities$);
    this.pastOrderService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
  }

  getRequest() {
    return this.restangular.one('pos', '6').customGET();
  }
}