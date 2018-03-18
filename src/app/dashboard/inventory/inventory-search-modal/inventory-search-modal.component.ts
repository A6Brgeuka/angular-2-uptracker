import { Component, OnInit } from '@angular/core';
import {DialogRef, Modal} from "angular2-modal";
import {ModalWindowService} from "../../../core/services/modal-window.service";
import {BSModalContext} from "angular2-modal/plugins/bootstrap";

export class InventorySearchModalContext extends BSModalContext {

}
@Component({
  selector: 'app-inventory-search-modal',
  templateUrl: './inventory-search-modal.component.html',
  styleUrls: ['inventory-search-modal.component.scss']
})
export class InventorySearchModalComponent implements OnInit {

  constructor(
    public dialog: DialogRef<InventorySearchModalContext>,
    public modalWindowService: ModalWindowService,
    public modal: Modal,
  ) {
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  getInventoryId(id) {
    this.dialog.close(id);
  }

}
