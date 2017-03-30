import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { EditUserModal } from '../../shared/modals/index';
import { UserService, AccountService } from '../../core/services/index';


@Component({
  selector: 'app-onboard-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
@DestroySubscribers()
export class OnboardUsersComponent implements OnInit {
  private subscribers: any = {};
  public userArr: any = [];

  constructor(
      private router: Router,
      public modal: Modal,
      private userService: UserService,
      private accountService: AccountService
  ) {
  }

  ngOnInit() {
    this.subscribers.getUsersSubscription = this.userService.selfData$.subscribe((res: any) => {
      if (res.account) { 
        this.userArr = res.account.users;
      }
    });
  }

  viewUserModal(user = null){
    this.modal.open(EditUserModal,  overlayConfigFactory({user: user}, BSModalContext));
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
