import { Injectable, Inject, NgZone, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CreditCardModel } from '../../models';
import { UserService } from './user.service';
import { ModelService } from '../../overrides/model.service.ts';
import { DefaultOptions } from '../../decorators/default-options.decorator';
import { Subscribers } from '../../decorators/subscribers.decorator';

@Injectable()
@DefaultOptions({
  modelEndpoint: '',
  expand: {
    default: []
  }
})
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null
})
export class CardService extends ModelService {
  
  static STATUS_BLOCKED = 0;
  static STATUS_ACTIVE = 1;
  
  constructor(
    public injector: Injector,
    public zone: NgZone,
    public userService: UserService
  ) {
    super(injector);
  
    this.onInit();
  }
  
  onInit() {
  }
  
  // addSubscribers(){
  //   this.entity$.subscribe((res) => {
  //     //update user after update account
  //     this.userService.loadSelfData();
  //   })
  // }

  getToken(data) {

    let source = Observable.create((observer) => {
      (<any>window).Stripe.card.createToken({
        number: data.cardNumber,
        exp_month: data.expMonth,
        exp_year: data.expYear,
        cvc: data.cvc,
      }, (status: number, response: any) => {
        this.zone.run(() => {
          if (status === 200) {
            let params = {
              token: response.id,
              country: response.card.country,
              expMonth: response.card.exp_month,
              expYear: response.card.exp_year,
              brand: response.card.brand,
              lastNumbers: response.card['last4'],
            };
            let cardData = new CreditCardModel(params);

            observer.next(cardData);
          } else {
            observer.error(response.error.message);
          }
        })
      });
    })
    .catch((err) => {
      this.toasterService.pop('error', err);
      return Observable.throw(err);
    });

    return source;
  }
}