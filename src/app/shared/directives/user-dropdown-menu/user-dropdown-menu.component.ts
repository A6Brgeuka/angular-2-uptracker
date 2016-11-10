import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { EditUserModal } from '../../modals/index';
import { UserService } from '../../../core/services/index';

@Component({
  selector: 'user-dropdown-menu',
  templateUrl: './user-dropdown-menu.component.html',
  styleUrls: ['./user-dropdown-menu.component.scss']
})
@DestroySubscribers()
export class UserDropdownMenuDirective implements OnInit {
  @Input() onlyLogout;
  
  private subscribers: any = {};
  public user: any;
  public userName: string;
  public userShortName: string;
  public showMenu: boolean;

  public constructor(
      private userService: UserService,
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal,
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit(){    
    this.showMenu = !this.onlyLogout;
    // this.user = this.userService.selfData;
    this.subscribers.gerSelfDataSubscription = this.userService.selfData$.subscribe((res: any) => {
      this.user = res;
      let nameArr = this.user.name.split(" ");
      let firstname = nameArr[0];
      let lastname = nameArr[nameArr.length-1];
      let shortFirstname = firstname.split("")[0];
      let shortLastname = lastname.split("")[0];
      this.userShortName = shortFirstname + shortLastname;
    });
  }

  editUserModal(){
    this.modal.open(EditUserModal,  overlayConfigFactory({user: this.user}, BSModalContext));
  }

  logOut(){
    this.userService.logout().subscribe();
  }
}
