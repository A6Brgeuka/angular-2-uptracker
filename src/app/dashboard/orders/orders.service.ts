import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { map, filter, intersectionBy } from 'lodash';

import { OrderTableFilterByService } from './directives/order-table/order-table-filter-by.service';

@Injectable()
export class OrdersService {
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public searchKey: string;
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);

  public activeChange$ = new Subject<{active: boolean, tab: string}>();
  public activeTab$: Observable<string>;

  public chips$;

  public filterItems$: Observable<any[]>;
  public onChipsChange$ = new Subject<string[]>();

  public filterQueryParams$: Subject<any> = new Subject();

  constructor(
    public orderTableFilterByService: OrderTableFilterByService,
  ) {
    this.activeTab$ = this.activeChange$
    .filter((event) => event.active)
    .map((event) => event.tab)
    .shareReplay(1);

    this.filterItems$ = this.activeTab$
    .switchMap((tab) =>
      this.orderTableFilterByService.getFilterByListName(tab)
    )
    .map((filterObj) => map(filterObj, (value, key) => ({value, key})))
    .map((items) => filter(items, 'value'))
    .shareReplay(1);

    this.chips$ = this.filterItems$
    .map((items) => map(items, (item) => item.value));

    this.onChipsChange$
    .withLatestFrom(this.filterItems$, this.activeTab$)
    .subscribe(([chips, filterItems, tab]) => {
      const chipsObj = chips.map((value) => ({value}));
      const items = intersectionBy(filterItems, chipsObj, 'value');
      const filter = items.reduce((acc, item) => ({...acc, [item.key]: item.value}), {});
      this.orderTableFilterByService.setFilterBy(filter, tab);
    });
  }

  updateFilterQueryParams(params) {
    this.filterQueryParams$.next(params);
  }

}
