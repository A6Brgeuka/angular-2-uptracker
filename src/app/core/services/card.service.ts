import { Injectable, Inject, NgZone, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CreditCardModel } from '../../models';
import { UserService } from './user.service';
import { ModelService } from '../../overrides/model.service';
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
  
  // static STATUS_BLOCKED = 0;
  // static STATUS_ACTIVE = 1;

  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  
  constructor(
    public injector: Injector,
    public zone: NgZone,
    public userService: UserService
  ) {
    super(injector);
  
    this.onInit();
  }
  
  onInit() {
    this.selfData$ = Observable.merge(
        this.updateSelfData$
    );
  }
  
  addSubscribers(){
    this.entity$.subscribe((res) => {
      // update user after update account
      // this.userService.loadSelfData();

      this.updateSelfData$.next(res);
    });
  }

  getToken(data) {

    let source = Observable.create((observer) => {
      (<any>window).Stripe.card.createToken({
        number: data.cardNumber,
        exp_month: data.expMonth,
        exp_year: data.expYear,
        cvc: data.cvc
      }, (status: number, response: any) => {
        this.zone.run(() => {
          if (status === 200) {
            let params = {
              stripe_token: response.id,
              country: response.card.country,
              expMonth: response.card.exp_month,
              expYear: response.card.exp_year,
              brand: response.card.brand,
              lastNumbers: response.card['last4']
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

  addCard(data){
    let api = this.apiEndpoint + 'register/payment';

    let body = JSON.stringify(data);

    let entity = this.http.post(api, body)
        .map(this.extractData.bind(this))
        .catch(this.handleError.bind(this))
        .publish().refCount();

    entity.subscribe(
        (res: any) => {
          // this.userService.loadSelfData();
          this.addToCollection$.next(res.data.account);
          this.updateEntity$.next(res.data.account);
          this.updateSelfData$.next(res.data.account);
        }
    );

    return entity;
  }
}