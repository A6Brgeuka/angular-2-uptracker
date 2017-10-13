import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { UserService } from '../../../core/services/index';

@Component({
  selector: 'custom-dropdown-menu',
  templateUrl: './custom-dropdown-menu.component.html',
  styleUrls: ['./custom-dropdown-menu.component.scss']
})
@DestroySubscribers()
export class CustomDropdownMenuDirective implements OnInit {
  @Input() model = [];
  
  public subscribers: any = {};

  public constructor(
      public userService: UserService,
  ) {
  }

  ngOnInit(){
  
  }
  
}
