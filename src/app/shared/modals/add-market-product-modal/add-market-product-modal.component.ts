import { Component, OnInit } from '@angular/core';
import {DialogRef, Modal} from 'angular2-modal';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { BrowseGlobalMarketModalComponent } from '../browse-global-market-modal/browse-global-market-modal.component';
import { AddNewProductModalComponent } from '../add-new-product-modal/add-new-product-modal.component';

export class AddMarketProductModalContext extends BSModalContext {

}

@Component({
  selector: 'app-add-product-modal',
  templateUrl: 'add-market-product-modal.component.html',
  styleUrls: ['add-market-product-modal.component.scss']
})
export class AddMarketProductModalComponent implements OnInit {

  public barcode: string = '';

  constructor(
    public dialog: DialogRef<AddMarketProductModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {

  }

  ngOnInit() {
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }

  openBrowseGlobalMarketModal() {
    this.dismissModal();
    this.modal
      .open(BrowseGlobalMarketModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({}, true, 'big'));
  }

  openAddNewProductModal() {
    this.dismissModal();
    this.modal
      .open(AddNewProductModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({}, true, 'big'));
  }

}
