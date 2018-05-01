import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange,
  SimpleChanges
} from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

import { OrderTableSortService } from './order-table-sort.service';
import { OrderTableService } from './order-table.service';
import { OrderTableOnVoidService } from './order-table-on-void.service';
import { OrderStatus } from '../../models/order-status';
import { OrderTableFilterByService } from './order-table-filter-by.service';
import { OrdersService } from '../../orders.service';
import { PastOrderService } from '../../../../core/services/pastOrder.service';

@Component( {
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss'],
  providers: [
    OrderTableSortService,
    OrderTableService,
    OrderTableOnVoidService,
  ]
})

@DestroySubscribers()

export class OrderTableComponent implements OnInit, OnDestroy, OnChanges {

  public orderStatus = OrderStatus;

  public asc = OrderTableSortService.ASC;

  public filterByObj$: Observable<any>;
  public sort$: Observable<any>;

  public _listName: string;

  @Input('uniqueField') public uniqueField: string;
  @Input('header') public header: any = [];
  @Input('listName') set listName(name: string) {
    this._listName = name;
    this.orderTableService.listName$.next(name);
  };
  @Output() sortByHeaderUpdated = new EventEmitter();
  @Output() filterBy = new EventEmitter();
  @Output() onFavoriteItem = new EventEmitter();
  @Output() onFlaggedItem = new EventEmitter();
  @Output() onVoidItem = new EventEmitter();
  @Input()
  set orders(value){
    this.orderTableService.setOrders$.next(value);
  }

  public componentId: string = _.uniqueId();
  public subscribers: any = {};

  public filteredOrders$:  Observable<any>;
  public checkedOrders$:  Observable<any>;

  private showHeaderMenu$: Observable<any>;

  constructor(
    public orderTableSortService: OrderTableSortService,
    public orderTableService: OrderTableService,
    public ordersService: OrdersService,
    private orderTableFilterByService: OrderTableFilterByService,
    private pastOrderService: PastOrderService,
  ) {
  }

  ngOnInit() {
    this.sort$ = this.orderTableSortService.sort$
    .shareReplay(1);

    this.filteredOrders$ = Observable.combineLatest(
      this.orderTableService.orders$,
      this.sort$.startWith(null),
      this.orderTableService.toggleSelect$.startWith(null),
    )
    .map(([orders, sort]: [any, any]) => {
      if (!sort) {
        return orders;
      }
        return _.orderBy(orders, [sort.alias], [sort.order]);
    });

    this.checkedOrders$ = this.filteredOrders$
    .map(orders => {
      return orders.filter(order => order.checked);
    });

    this.showHeaderMenu$ = this.filteredOrders$
    .map((orders) => {
      return _.findIndex(orders, {checked: true}) >= 0;
    });

    this.filterByObj$ = this.orderTableFilterByService.getFilterByListName(this._listName)
    .filter((obj) => !!obj)
    .startWith({});

  }

  ngOnDestroy() {
    this.orderTableService.destroySubscription();
    this.orderTableSortService.destroySubscription();
  }

  ngOnChanges(changes: SimpleChanges) {
    const uniqueField: SimpleChange = changes.uniqueField;
    if (uniqueField) {
      this.orderTableService.uniqueField = uniqueField.currentValue;
    }
  }

  setCheckbox(item) {
    this.orderTableService.toggleSelect(item[this.uniqueField]);
  }

  toggleSelectAll() {
    this.orderTableService.toggleSelectAll();
  }

  sortByHeaderCol(headerCol) {
    if (!headerCol.alias) {
      return;
    }
    this.orderTableSortService.sortByAlias(headerCol.alias);
  }

  onFilterBy(value, headerCol) {

    this.orderTableService.onFilterByAlias(value, headerCol);
    this.orderTableFilterByService.onFilterByAlias(value, headerCol, this._listName);

    this.filterBy.emit(value);
  }

  toggleStatusHistoryDetail(item) {
    item.statusHistoryVisibility = !item.statusHistoryVisibility;
  }

  onFavorite(event) {
    this.onFavoriteItem.emit(event);
  }

  onFlagged(event) {
    this.onFlaggedItem.emit(event);
  }

  onVoid(event) {
    this.onVoidItem.emit(event);
  }

  goToReconcile(item) {
    this.pastOrderService.goToReconcile(item.invoice_id);
  }
}
