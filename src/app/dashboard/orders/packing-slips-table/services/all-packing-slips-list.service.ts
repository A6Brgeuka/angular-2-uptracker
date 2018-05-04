import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { OrderListBaseService } from '../../classes/order-list-base.service';
import { PackingSlipsTableService } from './packing-slips-table.service';

@Injectable()
export class AllPackingSlipsListService extends OrderListBaseService {

  protected idName = 'id';

  constructor(
    private restangular: Restangular,
    private packingSlipsTableService: PackingSlipsTableService,
  ) {
    super(packingSlipsTableService);
    this.packingSlipsTableService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
  }

  getRequest(params) {
    return this.restangular.one('packingslips', 'all').customGET('', params);
  }
}
