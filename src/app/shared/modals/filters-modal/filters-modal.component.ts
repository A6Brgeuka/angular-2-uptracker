import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CloseGuard, DialogRef, ModalComponent } from 'angular2-modal';

export class FiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
})
@DestroySubscribers()
export class FiltersModalComponent implements CloseGuard, ModalComponent<FiltersModalContext> {
  context;
  private subscribers: any = {};

  vendors = new FormControl(['asdf', 'asdf']);
  categories = new FormControl(['category1', 'category2', 'category3']);

  autocompleteInit = {
    autocompleteOptions: {
      data: {
        'Apple': null,
        'Apple1': null,
        'Microsoft': null,
        'Microsoft111111111111111111111': null,
        'Google': null
      },
      limit: Infinity,
      minLength: 1
    }
  };

  constructor(
    public dialog: DialogRef<FiltersModalContext>,
  ) {
    this.context = dialog.context;
  }

  dismissModal() {
    this.dialog.dismiss();
  }
}
