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
      public activatedRoute: ActivatedRoute,
      public userService: UserService
  ) {
  }

  ngOnInit(){ 
  }
}
