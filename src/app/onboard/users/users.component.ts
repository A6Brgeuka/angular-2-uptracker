import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { UserModal } from './user-modal/user-modal.component';
// import { UserModel } from '../../models/index';
// import { UserService } from '../../core/services/index';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  constructor(
      private router: Router,
      vcRef: ViewContainerRef,
      overlay: Overlay,
      public modal: Modal
  ) {
    overlay.defaultViewContainer = vcRef;
  }

  ngOnInit() {
  }

  viewUsersModal(){
    this.modal.open(UserModal,  overlayConfigFactory(BSModalContext));
  }
  
  goBack(){
    this.router.navigate(['/onboard','locations']);    
  }
  
  goNext(){
    this.router.navigate(['/onboard','products']);
  }

}
