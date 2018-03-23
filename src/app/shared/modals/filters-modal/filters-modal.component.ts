import { Component, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from 'angular2-modal';

export class FiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
})
@DestroySubscribers()
export class FiltersModalComponent implements OnInit, ModalComponent<FiltersModalContext> {
  context;
  private subscribers: any = {};

  constructor(
    public dialog: DialogRef<FiltersModalContext>,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {

  }

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {

  }

}
