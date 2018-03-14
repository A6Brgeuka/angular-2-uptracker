import { Component } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CloseGuard, DialogRef, ModalComponent } from 'angular2-modal';

import { AccountService } from '../../../core/services/account.service';

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

  locations$ = this.accountService.locations$;
  discounts = ['Bogo', 'Percent Off', 'Rewards Points Used'];

  constructor(
    public dialog: DialogRef<FiltersModalContext>,
    private accountService: AccountService,
  ) {
    this.context = dialog.context;
  }

  addSubscribers() {

  }

  dismissModal() {
    this.dialog.dismiss();
  }

}
