import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { OrderListBaseService } from '../../classes/order-list-base.service';
import { InvoicesTableService } from './invoices-table.service';

@Injectable()
export class PaidInvoicesListService extends OrderListBaseService {

  protected idName = 'invoice_id';

  constructor(
    private restangular: Restangular,
    private invoicesTableService: InvoicesTableService,
  ) {
    super(invoicesTableService);
    this.invoicesTableService.addCollectionStreamToEntittesStream(this.getCollectionRequest$);
  }

  getRequest(params) {
    return this.restangular.one('invoices', 'paid').customGET('', params);
  }
}
