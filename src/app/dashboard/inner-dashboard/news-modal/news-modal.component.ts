import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService } from '../../../core/services/user.service';
import { DashboardService } from '../../../core/services/dashboard.service';

export class InviteUserModalContext extends BSModalContext {
}

@Component({
  selector: 'news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.scss']
})
@DestroySubscribers()
export class NewsModal implements OnInit, CloseGuard, ModalComponent<InviteUserModalContext> {
  context: InviteUserModalContext;
  
  constructor(
      public dialog: DialogRef<InviteUserModalContext>,
      public userService: UserService,
      public dashboardService: DashboardService
  ) {
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
  
}
