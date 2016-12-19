import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { AccountService, UserService, ModalWindowService } from '../../../core/services/index';
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
  private subscribers: any = {};
  context: ViewUserModalContext;
  public user: any;
  public message: any = {};
  public messageConfirm: boolean = false;
  public toSendMessage: boolean = false;

  constructor(
      public dialog: DialogRef<ViewUserModalContext>,
      public userService: UserService,
      public accountService: AccountService,
      public modalWindowService: ModalWindowService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    let userData = this.context.user || {};
    this.user = new UserModel(userData);
    this.toSendMessage = userData.sendMessage || false;
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
  
  deleteUser(user){
    this.modalWindowService.confirmModal('Delete user?', 'Are you sure you want to delete the user?', this.deleteUserFunc.bind(this));
  }

  deleteUserFunc(){
    this.subscribers.deleteUserSubscription = this.accountService.deleteUser(this.user).subscribe((res: any) => {
      this.dismissModal();
    });
  }

  confirmMessage() {
    this.messageConfirm = true;
  }

  sendNewMessage() {
    this.message = {};
    this.messageConfirm = false;
  }
}
