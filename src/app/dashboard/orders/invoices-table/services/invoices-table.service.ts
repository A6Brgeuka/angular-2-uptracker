import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { EntitiesService } from '../../classes/entities.service';
import { OrdersService } from '../../orders.service';
import { StateService } from '../../../../core/services/state.service';

@Injectable()
export class InvoicesTableService extends EntitiesService {
  protected idName = 'invoice_id';
  protected url = '/orders/invoices';

  constructor(
    public restangular: Restangular,
    public ordersService: OrdersService,
    public stateService: StateService,
  ) {
    super(restangular, ordersService, stateService);
  }
}
