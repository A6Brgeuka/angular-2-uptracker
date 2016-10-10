import { Component } from '@angular/core';

import { UserService, CardService, AccountService } from '../../../core/services/index';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent {
  signupAccount: any = {
    account: {},
    user: {},
    card: {}
  };

  constructor(
      private userService: UserService,
      private accountService: AccountService,
      private cardService: CardService
  ) { }

}
