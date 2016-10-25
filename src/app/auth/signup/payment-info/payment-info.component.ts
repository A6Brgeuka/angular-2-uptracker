import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserModel, CreditCardModel } from '../../../models/index';
import { UserService, CardService, AccountService, SpinnerService } from '../../../core/services/index';


@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {
  public creditCard: CreditCardModel;
  public trialCode: string;
  public cardMask: any;
  public masks = {
    expYear: [ /\d/, /\d/],
    cvc: [ /\d/, /\d/, /\d/, /\d/]
  };
  public selectMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public selectYear = [];
  public yearDirty: boolean = false;
  public monthDirty: boolean = false;

  constructor(
      private router: Router,
      private userService: UserService,
      private accountService: AccountService,
      private spinnerService: SpinnerService,
      private cardService: CardService
  ) {
    let signupStep = this.userService.currentSignupStep();
    if (signupStep && signupStep < 3) {
      this.router.navigate(['/signup']);
    }
    this.cardMask = function(value){
      let cardOther = [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      let cardAmex = [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/];
      let cardStr = '' + value;
      let cardArr = cardStr.split("");
      if (cardArr[0] == '3' && (cardArr[1] == '4' || cardArr[1] == '7'))
        return cardAmex;
      else
        return cardOther;
    }
  }

  ngOnInit() {
    this.creditCard = new CreditCardModel;
    this.trialCode = '';
    let currentYear = new Date().getFullYear();
    for (let i = 0; i < 21; i++){
      this.selectYear.push(currentYear+i);
    }
  }

  changeYear(){
    this.yearDirty = true;
  }

  changeMonth(){
    this.monthDirty = true;
  }

  onSubmit(){
    if (this.trialCode != '') {
      this.router.navigate(['/signup/congrats']);
    } else {
      let self = this;
      this.cardService.getToken(self.creditCard)
          .switchMap(cardData => {
            cardData.trial_code = self.trialCode;
            // set account_id
            // if user is logged in and created company (have account_id)
            cardData.account_id = self.userService.selfData ? self.userService.selfData.account_id || null : null;
            return self.cardService.addCard(cardData);
          })
          .subscribe((res: any) => {
            self.accountService.updateSelfData(res.data.account);
            this.router.navigate(['/signup/congrats']);
          });
    }
  }

}
