import { Component, OnInit } from '@angular/core';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { ModalWindowService } from '../../core/services/modal-window.service';
import { ReportsFilterModal } from './reports-filter-modal/reports-filter-modal.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
@DestroySubscribers()
export class ReportsComponent implements OnInit {

  
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
  ) {
  }
  
  ngOnInit() {}

  showFiltersModal() {
    this.modal
    .open(ReportsFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          // this.filterProducts();
        },
        (err) => {
        }
      );
    });
  }
}
