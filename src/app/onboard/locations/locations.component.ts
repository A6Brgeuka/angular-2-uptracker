import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { LocationModal } from './location-modal/location-modal.component';
import { UserService, AccountService } from '../../core/services/index';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
@DestroySubscribers()
export class LocationsComponent implements OnInit {
  public locationArr: any = [];
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
    this.subscribers.getLocationsSubscription = this.userService.selfData$.subscribe((res: any) => {
      if (res.account) {
        this.locationArr = res.account.locations;
      }
    });
  }

  viewLocationModal(location = null){
    this.modal.open(LocationModal,  overlayConfigFactory({ location: location }, BSModalContext));
  }

  goNext(){
    this.router.navigate(['/onboard','users']);
  }

}
