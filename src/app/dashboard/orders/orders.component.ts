import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { ModalWindowService } from '../../core/services/modal-window.service';
import { ToasterService } from '../../core/services/toaster.service';
import { OrderTableResetService } from './directives/order-table/order-table-reset.service';
import { OrdersPageFiltersComponent } from '../../shared/modals/filters-modal/orders-page-filters/orders-page-filters.component';
import { OrdersService } from './orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent {
  public subscribers: any = {};

  constructor(
      public modal: Modal,
      public router: Router,
      public modalWindowService: ModalWindowService,
      public toasterService: ToasterService,
      public orderTableResetService: OrderTableResetService,
      public ordersService: OrdersService,
  ) {
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
    this.ordersService.filterQueryParams$.next(null);
    this.orderTableResetService.resetFilters();
  }

  changeDataType(event) {
    this.resetFilters();
    this.router.navigate([`orders${event}`]);
  }
}
