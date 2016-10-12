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
    // getting state collection
    this.activatedRoute.data.forEach((data: { selfData: any }) => {
      self.userService.selfData; console.log(data);
      // debugger;
      // let selfData = data.selfData.data.user;
      // selfData.account = data.selfData.data.account;
      // this.userService.updateSelfData(data.selfData);
    });
  }
}
