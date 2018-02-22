import { Component, EventEmitter, Input, Output } from '@angular/core';

export type SearchType = 'keyword' | 'chips' | 'multiple';


@Component({
  selector: 'app-search-filter-header',
  templateUrl: './search-filter-header.component.html',
  styleUrls: ['./search-filter-header.component.scss'],
})
export class SearchFilterHeaderComponent {

  @Input() public title:  string;
  @Input() public searchKey: string;
  @Input() public searchType: SearchType = 'keyword';
  @Output() searchEvent = new EventEmitter();
  @Output() resetEvent = new EventEmitter();
  @Output() openModalEvent = new EventEmitter();

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

}
