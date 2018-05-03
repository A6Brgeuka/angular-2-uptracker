import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { find } from 'lodash';

import { OrdersService } from '../../../dashboard/orders/orders.service';

export type SearchFilterHeaderType = 'keyword' | 'chips' | 'multiple';

export const SearchType: {[key: string]: SearchFilterHeaderType} = {
  KEYWORD: 'keyword',
  CHIPS: 'chips',
  MULTIPLE: 'multiple',
};

@Component({
  selector: 'app-search-filter-header',
  templateUrl: './search-filter-header.component.html',
  styleUrls: ['./search-filter-header.component.scss'],
})
@DestroySubscribers()
export class SearchFilterHeaderComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  @Input() public title:  string;
  @Input() public className:  string = '';
  @Input() public searchKey: string;
  @Input() public searchType: SearchFilterHeaderType = SearchType.KEYWORD;
  @Input() chips = [];
  @Input() isTitleSelect = false;
  @Output() chipsChange = new EventEmitter();
  @Output() searchEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Output() openModalEvent = new EventEmitter();
  public dataTypeArr: any[] = [
    {value: '/orders', title: 'Orders'},
    {value: '/orders/items', title: 'Order Items'},
    {value: '/orders/packing-slips', title: 'Packing Slips'},
    {value: '/orders/invoices', title: 'Invoices'},
  ];

  constructor(
    private ordersService: OrdersService,
  ) {

  }

  get isChips() {
    return this.searchType === SearchType.CHIPS;
  }

  get isKeyword() {
    return this.searchType === SearchType.KEYWORD;
  }

  get isMultiple() {
    return this.searchType === SearchType.MULTIPLE;
  }

  ngOnInit() {
    this.subscribers.getChildRoutePathSubscription = this.ordersService.tableRoute$
    .subscribe((res: any) => {
      this.title = find(this.dataTypeArr, {'value': res}).title;
    });
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  searchFilter(event) {
    this.searchKey = event;
    this.searchEvent.emit(event);
  }

  showFiltersModal() {
    this.openModalEvent.emit();
  }

  resetFilters() {
    this.resetEvent.emit();
  }

  updateTitle(title) {
    this.title = title;
  }
}
