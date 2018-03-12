import { Component, OnInit } from '@angular/core';
import {DialogRef, Modal} from 'angular2-modal';
import { AddCustomProductModalComponent } from '../add-custom-product-modal/add-custom-product-modal.component';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

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

  openAddCustomProductModal() {
    this.modal
      .open(AddCustomProductModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({}, true))
      .then((resultPromise) => {
        resultPromise.result.then(
          (res) => {
            /*this.updateCollectionCustomProduct$.next(true);*/
          },
          (err) => {
          }
        );
      });
  }

}
