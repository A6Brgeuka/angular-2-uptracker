import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as lodashReject from 'lodash/reject';

import { UserModal } from './user-modal/user-modal.component';
import { UserService, AccountService } from '../../core/services/index';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
@DestroySubscribers()
export class UsersComponent implements OnInit {
  public userArr: any = [];
  private subscribers: any = {};

  constructor(
      private router: Router,
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal,
      private userService: UserService,
      private accountService: AccountService
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
    this.subscribers.getUsersSubscription = this.userService.selfData$.subscribe((res: any) => {
      if (res.account) {
        this.userArr = lodashReject(res.account.users, {'id': res.id});
      }
    });
  }

  viewUserModal(user = null){
    this.modal.open(UserModal,  overlayConfigFactory({user: user}, BSModalContext));
  }
  
  goBack(){
    this.router.navigate(['/onboard','locations']);    
  }
  
  goNext(){
    this.router.navigate(['/onboard','accounting']);
  }
  
  upload(){
    
  }
  
  download(){
    
  }

}
