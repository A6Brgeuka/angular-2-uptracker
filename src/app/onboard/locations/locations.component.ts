import { Component, OnInit, ElementRef } from '@angular/core';
// import { UserModel } from '../../models/index';
// import { UserService } from '../../core/services/index';

declare var jQuery:any;

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  public elementRef;

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
