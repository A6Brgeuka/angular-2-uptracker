import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { LocationModal } from './location-modal/location-modal.component';
import { UserService, AccountService } from '../../core/services/index';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  public locationArr: any = [];
  private getLocationsSubscription: any = null;

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
    this.getLocationsSubscription = this.userService.selfData$.subscribe((res: any) => {
      if (res.account) {
        this.locationArr = res.account.locations;
      }
    });
  }
  
  ngOnDestroy() {
    if (this.getLocationsSubscription) {
      this.getLocationsSubscription.unsubscribe();
    }
  }

  viewLocationModal(){
    this.modal.open(LocationModal,  overlayConfigFactory(BSModalContext));
  }

  goNext(){
    this.router.navigate(['/onboard','users']);
  }

}
