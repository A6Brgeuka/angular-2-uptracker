import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }                 from '@angular/common';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { AccountService, ModalWindowService } from '../../../core/services/index';
import { LocationModel } from '../../../models/index';
import { LocationService } from "../../../core/services/location.service";
import { Observable } from 'rxjs';
import * as _ from 'lodash';


@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.scss']
})
@DestroySubscribers()
export class ViewLocationComponent implements OnInit {
  public subscribers: any = {};
  public location: LocationModel;
  public locationId: string;
  
  constructor(
    public accountService: AccountService,
    public windowLocation: Location,
    public route: ActivatedRoute,
    public locationService: LocationService,
    public modalWindowService: ModalWindowService
  ) {
    this.location = new LocationModel();
  }
  
  ngOnInit() {
    this.route.params
    .switchMap((params: Params) =>
      this.locationService.collection$.map((m: any) => {
          return m.filter(l => l.id == params['id']);
        }
      )
    )
    .filter(l => !_.isEmpty(l))
    .map(l=>l[0])
    .subscribe(location => {
      this.location = new LocationModel(location);
      this.location.street_1 = this.location.address.street_1;
      this.location.street_2 = this.location.address.street_2;
      this.location.city = this.location.address.city;
      this.location.zip_code = this.location.address.postal_code;
      this.location.state = this.location.address.state;
    });
  }
  
  deleteLocation(location) {
    this.modalWindowService.confirmModal('Delete location?', 'Are you sure you want to delete the location?', this.deleteLocationFunc.bind(this));
  }
  
  deleteLocationFunc() {
    this.subscribers.deleteUserSubscription = this.locationService.deleteLocation(this.location).subscribe((res: any) => {
     this.goBack();
    });
  }
  
  goBack(): void {
    this.windowLocation.back();
  }
  
}
