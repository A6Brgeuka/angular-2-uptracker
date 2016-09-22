import { Component, OnInit } from '@angular/core';

import { CreditCardModel } from '../../../models/index';
import { UserModel } from '../../../models/index';
import { UserService, CardService } from '../../../core/services/index';


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

  constructor() { }

  ngOnInit() {
    this.creditCard = new CreditCardModel;
    this.trialCode = '';
  }

}
