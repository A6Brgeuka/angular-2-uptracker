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
  creditCard: CreditCardModel;
  trialCode: string;
  public masks = {
    card: [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    cardOther: [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    cardAmex: [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/],
    expYear: [ /\d/, /\d/],
    cvc: [ /\d/, /\d/, /\d/],
  };
  public selectMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  public selectYear = [];
  yearDirty: boolean = false;
  monthDirty: boolean = false;

  constructor(
      private router: Router,
      private userService: UserService,
      private accountService: AccountService,
      private spinnerService: SpinnerService,
      private cardService: CardService
  ) {
    // this.userService.loadSelfData().subscribe((res: any) => {
    //   // TODO:
    //   // check response and add account_id to condition
    //   // if user is logged in and created company (have account_id) redirect him
    //   debugger;
    //   if (!this.userService.isGuest() && res.account_id){
    //     this.router.navigate(['/dashboard']);
    //   }
    // });

    // check for user_id
    let user_id = this.userService.getSelfIdFromSelfData();

    // if guest (user without id) then redirect him to login page
    if (!user_id) {
      this.router.navigate(['/login']);
      return;
    }

    // check for payment info
    // if user is logged in and added payment info redirect him
    let account = this.userService.selfData ? this.userService.selfData.account || null : null;
    if (account){
      let payment_token = account.payment_token || null;
      let trial_code = account.trial_code || null;
      if (!this.userService.isGuest() && (payment_token || trial_code) ){
        this.router.navigate(['/dashboard']);
      }
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

  checkMask(){
    let cardStr = '' + this.creditCard.cardNumber;
    let cardArr = cardStr.split("");
    if (cardArr[0] == '3' && (cardArr[1] == '4' || cardArr[1] == '7'))
      this.masks.card = this.masks.cardAmex;
    else
      this.masks.card = this.masks.cardOther;
  }

  onSubmit(){
    if (this.trialCode != '') {
      this.router.navigate(['/signup/congrats']);
    } else {
      this.spinnerService.show();
      let self = this;
      this.cardService.getToken(self.creditCard)
          .switchMap(cardData => {
            cardData.trial_code = self.trialCode;
            // set account_id
            // if user is logged in and created company (have account_id)
            let account_id = self.userService.selfData ? self.userService.selfData.account_id || null : null;
            if (account_id){
              cardData.account_id = account_id;
            } else {
              self.accountService.entity$
                  .subscribe((res) => {
                    cardData.account_id = res.id;
                  });
            }
            return self.cardService.addCard(cardData);
          })
          .subscribe((res: any) => {
            self.spinnerService.hide();
            self.accountService.updateSelfData$.next(res.data.account);
            this.router.navigate(['/signup/congrats']);
          });
    }
  }

}
