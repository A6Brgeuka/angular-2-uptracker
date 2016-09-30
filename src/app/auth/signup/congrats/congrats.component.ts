import { Component, OnInit } from '@angular/core';

import { UserService, CardService, AccountService } from '../../../core/services/index';

@Component({
  selector: 'app-congrats',
  templateUrl: './congrats.component.html',
  styleUrls: ['./congrats.component.scss']
})
export class CongratsComponent implements OnInit {
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

  ngOnInit() {
    // this.accountService.entity$
    //     .subscribe((res: any) => {
    //       this.signupAccount.account = res;
    //     });
    // this.userService.entity$
    //     .subscribe((res: any) => {
    //       this.signupAccount.user = res;
    //     });
    // this.cardService.entity$
    //     .subscribe((res: any) => {
    //       this.signupAccount.card = res;
    //     });
  }

}
