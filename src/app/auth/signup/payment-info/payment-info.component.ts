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
    cardAmex: [ /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
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
    if (!this.userService.isGuest()){
      this.router.navigate(['/dashboard']);
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
            self.accountService.entity$
                .subscribe((res) => {
                  console.log(res);
                  cardData.account_id = res.id;
                });
            return self.cardService.addCard(cardData);
          })
          .subscribe((res: any) => {
            this.spinnerService.hide();
            this.router.navigate(['/signup/congrats']);
          });
    }
  }

}
