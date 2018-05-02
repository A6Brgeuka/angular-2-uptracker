import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class HelpTextModalContext extends BSModalContext {
  public text: any;
  public link: any;
}


@Component({
  selector: 'app-help-text-modal',
  templateUrl: './help-text-modal.component.html',
  styleUrls: ['./help-text-modal.component.scss']
})
export class HelpTextModal implements OnInit, ModalComponent<HelpTextModalContext> {
  context: HelpTextModalContext;
  constructor(
    public dialog: DialogRef<HelpTextModalContext>,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {}

  dismissModal() {
    this.dialog.dismiss();
  }
}
