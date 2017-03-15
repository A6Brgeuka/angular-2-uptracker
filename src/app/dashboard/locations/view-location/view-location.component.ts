import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { AccountService, ModalWindowService } from '../../../core/services/index';
import { LocationModel } from '../../../models/index';
import { LocationService } from "../../../core/services/location.service";
import { Observable } from 'rxjs';


@Component({
  selector: 'app-view-location',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.scss']
})
@DestroySubscribers()
export class ViewLocationComponent implements OnInit {
  private subscribers: any = {};
  public location: LocationModel;
  private locationId: string;
  
  constructor(
    public accountService: AccountService,
    private route: ActivatedRoute,
    public locationService: LocationService,
    public modalWindowService: ModalWindowService
  ) {
    this.location = new LocationModel();
  }
  
  ngOnInit() {
    this.route.params
    .switchMap((params: Params) =>
      this.locationService.getLocations().map((m: any) =>
        m.filter(l =>
          (l.id == params['id']))
      )
    )
    .subscribe(location => {
    });
    //this.user = _.filter(user,(us:any) => (us.id == this.userId))[0];
    //this.userLocations = _.filter(this.accountService.selfData.locations, (location: any) => {
    //  let userLocation: any = _.find(this.user.locations, {location_id: location.id});
    //  if (userLocation) {
    //    return userLocation.checked;
    //  }
    //  return false;
    //});
    
    
    //let locationData = this.context.location || {};
    //this.location = new LocationModel(locationData);
    //if (this.context.location){
    //  this.location.street_1 = this.location.address.street_1;
    //  this.location.street_2 = this.location.address.street_2;
    //  this.location.city = this.location.address.city;
    //  this.location.zip_code = this.location.address.postal_code;
    //  this.location.state = this.location.address.state;
  }
  
  
  editLocation(location = null) {
    //this.closeModal(location);
  }
  
  deleteLocation(location) {
    this.modalWindowService.confirmModal('Delete location?', 'Are you sure you want to delete the location?', this.deleteLocationFunc.bind(this));
  }
  
  deleteLocationFunc() {
    this.subscribers.deleteUserSubscription = this.locationService.deleteLocation(this.location).subscribe((res: any) => {
      //this.dismissModal();
    });
  }
}
