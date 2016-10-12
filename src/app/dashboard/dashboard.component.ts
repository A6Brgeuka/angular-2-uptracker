import { Component } from '@angular/core';

import { UserService, SpinnerService } from '../core/services/index';

@Component({
  selector: 'app-dashboard',
  styleUrls: [ './dashboard.style.scss' ],
  templateUrl: './dashboard.template.html'
})
export class DashboardComponent {
  public selectedOption = '';

  constructor(
      private userService: UserService,
      private spinnerService: SpinnerService
  ) {
  }

  logOut(){
    this.spinnerService.show();
    this.userService.logout()
        .subscribe((res) => {
          this.spinnerService.hide();
        });
  }

}
