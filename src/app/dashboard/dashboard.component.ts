import { Component } from '@angular/core';

import { UserService } from '../core/services/index';

@Component({
  selector: 'app-dashboard',
  styleUrls: [ './dashboard.style.scss' ],
  templateUrl: './dashboard.template.html'
})
export class DashboardComponent {
  public selectedOption = '';

  constructor(
      private userService: UserService
  ) {
  }

}
