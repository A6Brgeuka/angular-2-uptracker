import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../core/services/index';

@Component({
  selector: 'user-dropdown-menu',
  templateUrl: './user-dropdown-menu.component.html',
  styleUrls: ['./user-dropdown-menu.component.scss']
})
export class UserDropdownMenuDirective implements OnInit {

  public constructor(
      private userService: UserService
  ) {
  }

  ngOnInit(){
  }

  logOut(){
    this.userService.logout().subscribe();
  }
}
