import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from './core/services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  constructor(
      private activatedRoute: ActivatedRoute,
      private userService: UserService
  ) {
  }

  ngOnInit(){
    let self = this;
    // getting user self data
    this.activatedRoute.data.forEach((data: { selfData: any }) => {
      console.log('Current user data ', self.userService.selfData);
      //console.log(data.selfData);
      // debugger;
    });
  }
}
