import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { AccountService, UserService } from '../../../core/services/index';
import { UserModel } from '../../../models/index';

export class ViewUserModalContext extends BSModalContext {
  public user: any;
}

@Component({
  selector: 'app-view-user-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.scss']
})
@DestroySubscribers()
export class ViewUserModal implements OnInit, CloseGuard, ModalComponent<ViewUserModalContext> {
  context: ViewUserModalContext;
  public user: any;

  constructor(
      public dialog: DialogRef<ViewUserModalContext>
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    let userData = this.context.user || {};
    console.log(userData);
    this.user = new UserModel(userData);
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  editUser(user = null){
    this.closeModal(user);
  }
}
