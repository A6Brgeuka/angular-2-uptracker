import { Component, OnInit, Input } from '@angular/core';

import { UserService } from '../../../core/services/index';

@Component({
  selector: 'user-dropdown-menu',
  templateUrl: './user-dropdown-menu.component.html',
  styleUrls: ['./user-dropdown-menu.component.scss']
})
export class UserDropdownMenuDirective implements OnInit {
  @Input() onlyLogout;
  public userName: string;
  public userShortName: string;
  public showMenu: boolean;

  public constructor(
      private userService: UserService
  ) {
  }

  ngOnInit(){
    this.showMenu = !this.onlyLogout; 
    this.userName = this.userService.selfData.name;
    let nameArr = this.userName.split(" ");
    let firstname = nameArr[0];
    let lastname = nameArr[nameArr.length-1];
    let shortFirstname = firstname.split("")[0];
    let shortLastname = lastname.split("")[0];
    this.userShortName = shortFirstname + shortLastname;
  }

  logOut(){
    this.userService.logout().subscribe();
  }
}
