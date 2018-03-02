import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

export class ConfirmModalContext extends BSModalContext {
  public title: string;
  public content: any;
  constructor(t, c) {
   super();
    this.title = t ? t : 'Please confirm:';
    this.content = c ? c : 'Are You sure?';
  }
}

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
@DestroySubscribers()
export class ConfirmModalComponent implements OnInit, ModalComponent<ConfirmModalContext> {
  context: ConfirmModalContext;

  constructor(
    public dialog: DialogRef<ConfirmModalContext>,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {}

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data = { success: true }) {
    this.dialog.close(data);
  }
}
