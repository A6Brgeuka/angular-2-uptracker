import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { ReceivedOrderService } from '../../../core/services/received-order.service';

import { ReceiveOrderItemModel } from './models/order-item-form.model';
import { ReceiveOrderModel } from './models/order-form.model';
import { ReceiveFormModel } from './models/receive-form.model';

@Injectable()
export class ReceiveService {

  public invoice$: Observable<ReceiveFormModel>;
  public invoiceOrders$: Observable<ReceiveOrderModel[]>;
  public invoiceItems$: Observable<ReceiveOrderItemModel[]>;
  public orderEntities$: Observable<{[order_id: string]: ReceiveOrderModel}>;
  public itemEntities$: Observable<{[item_id: string]: ReceiveOrderItemModel}>;
  public takeInvoiceData$: Subject<any> = new Subject();

  constructor(
    public receivedOrderService: ReceivedOrderService,
  ) {

    this.invoice$ = this.takeInvoiceData$
    .switchMap((param) =>
      this.receivedOrderService.getReceiveProduct(param.queryParams)
    )
    .shareReplay(1);

    this.invoiceOrders$ = this.invoice$
    .map((invoice) => invoice.orders);

    this.orderEntities$ = this.invoiceOrders$
    .map((invoiceOrders) =>
      invoiceOrders.reduce((entities, order) => ({
        ...entities,
        [order.order_id]: order,
      }), {})
    );

    this.invoiceItems$ = this.invoiceOrders$
    .map((invoiceOrders) =>
      invoiceOrders.reduce((acc: any[], order) =>
        [...acc, ...order.items], []
      )
    );

    this.itemEntities$ = this.invoiceItems$
    .map((invoiceItems) =>
      invoiceItems.reduce((entities, item) => ({
        ...entities,
        [item.id]: item,
      }), {})
    );

  }

  getOrder(id: string) {
    return this.orderEntities$
    .map((entities) => entities[id]);
  };

  getItem(id: string) {
    return this.itemEntities$
    .map((entities) => entities[id]);
  };

  takeInvoiceData(param) {
    this.takeInvoiceData$.next(param);
    return this.invoice$;
  }

}
