import { Injectable, NgZone, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { CreditCardModel } from '../../models';
import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
// import { DefaultOptions } from '../../decorators/default-options.decorator';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { CardResource } from '../../core/resources/index';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null
})
export class CardService extends ModelService {
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  
  constructor(
    public injector: Injector,
    public zone: NgZone,
    public cardResource: CardResource,
    public userService: UserService
  ) {
    super(injector, cardResource);
  
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
            this.spinnerService.hide();
          }
        })
      });
    })
    .catch((err) => {
      this.spinnerService.hide();
      this.toasterService.pop('error', err);
      return Observable.throw(err);
    });

    return source;
  }

  addCard(data){
    let entity = this.resource.addCard(data).$observable
        .publish().refCount();

    entity.subscribe(
        (res: any) => {
          this.addToCollection$.next(res.data.account);
          this.updateEntity$.next(res.data.account);
          this.updateSelfData$.next(res.data.account);
        }
    );

    return entity;
  }
}