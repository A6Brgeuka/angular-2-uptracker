import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserModel, CreditCardModel } from '../../../models/index';
import { UserService, CardService, AccountService } from '../../../core/services/index';


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

    // console.log(this.accountService);

    // this.accountService.selfData$ = Observable.merge(
    //     this.updateSelfData$
    // );

    // let res = {
    //   account_id: 'asdasdasdasdasdas'
    // };
    // this.accountService.addToCollection$.next(res);
    // this.accountService.updateEntity$.next(res);
    // this.accountService.updateSelfData$.next(res);
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
    }
    let self = this;
    this.cardService.getToken(self.creditCard)
        .switchMap(cardData => {
          cardData.trial_code = self.trialCode;
          self.accountService.entity$
              .subscribe((res) => {
                console.log(res);
                cardData.account_id = res.id;
              });
          console.log(2222222222222222222);
          console.log(cardData);
          // return self.accountService.entity$;
          return self.cardService.addCard(cardData);
        })
        .subscribe((res) => {
          // this.resetCreateCardForm();
          // res.trial_code = '';
          // res.account_id = this.accountService.selfData.account_id;
          // console.log(res); debugger;
          // this.cardService.addCard(res);

          console.log(33333333333333333333333333333);
          console.log(res.data.account);
          this.router.navigate(['/signup/congrats']);
        });
  }

}
