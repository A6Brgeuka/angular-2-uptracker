import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

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
export class SearchFilterHeaderComponent implements OnDestroy {
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
  @Output() changeDataTypeEvent = new EventEmitter();
  selectedDataType = '';
  dataTypeArr: any[] = [
    {value: '/', title: 'Orders'},
    {value: '/items', title: 'Order Items'},
    {value: '/packing-slips', title: 'Packing Slips'},
    {value: '/invoices', title: 'Invoices'},
  ];

  constructor(
    public route: ActivatedRoute,
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

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  addSubscribers() {
    if (this.route && this.route.firstChild) {
      this.subscribers.getChildRoutePathSubscription = this.route.firstChild.url
      .subscribe(res =>
        this.selectedDataType = (res.length) ? `/${res[0].path}` : ''
      );
    }
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

  changeDataType(selectedData) {
    this.changeDataTypeEvent.emit(selectedData);
  }
}
