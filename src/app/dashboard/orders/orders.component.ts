import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { ModalWindowService } from '../../core/services/modal-window.service';
import { ToasterService } from '../../core/services/toaster.service';
import { OrderTableResetService } from './directives/order-table/order-table-reset.service';
import { OrdersPageFiltersComponent } from '../../shared/modals/filters-modal/orders-page-filters/orders-page-filters.component';
import { OrdersService } from './orders.service';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit, OnDestroy {
  public subscribers: any = {};

  constructor(
      public modal: Modal,
      public router: Router,
      public modalWindowService: ModalWindowService,
      public toasterService: ToasterService,
      public orderTableResetService: OrderTableResetService,
      public ordersService: OrdersService,
      public stateService: StateService,
  ) {
  }

  ngOnInit() {
    this.subscribers.resetFiltersSubscription = this.stateService.navigationEndUrl$
    .subscribe(() => this.resetFilters());
  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  onChipChange(chips) {
    this.ordersService.onChipsChange$.next(chips);
  }

  searchOrders(event) {
    // replace forbidden characters
    const value = event.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    this.ordersService.searchKey$.next(value);
  };

  showFiltersModal() {
    this.modal
    .open(OrdersPageFiltersComponent, this.modalWindowService.overlayConfigFactoryWithParams({}));
  }

  resetFilters() {
    this.ordersService.updateFilterQueryParams(null);
    this.orderTableResetService.resetFilters();
  }

}
