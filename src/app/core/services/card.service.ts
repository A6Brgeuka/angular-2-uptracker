import {Injectable, Inject, NgZone} from "@angular/core";
import {Observable} from "rxjs/Observable";

import {CreditCardModel}           from '../../models';
import {HttpClient} from "./http.service";
import {ToasterService} from "./toaster.service";
import {UserService} from "./user.service";
import {APP_CONFIG, AppConfig} from "../../app.config";
import {ModelService} from "../../overrides/ModelService.ts";

@Injectable()
export class CardService extends ModelService {
  
  static STATUS_BLOCKED = 0;
  static STATUS_ACTIVE = 1;
  
  constructor(
    public zone:NgZone,
    public userService:UserService,
    public http:HttpClient,
    public toasterService:ToasterService,
    @Inject(APP_CONFIG) appConfig:AppConfig
  ) {
    super({
      childClassName: CardService.name,
      modelEndpoint: 'cards',
      expand: {
        default: [],
      }
    }, http, toasterService, appConfig);
  
    this.onInit();
  }
  
  onInit() {
    this.addSubscribers();
  }
  
  addSubscribers(){
    this.entity$.subscribe((res)=> {
      //update user after update account
      this.userService.loadSelfData();
    })
  }
  
  getToken(data) {
    
    let source = Observable.create((observer) => {
      (<any>window).Stripe.card.createToken({
        number: data.cardNumber,
        exp_month: data.expMonth,
        exp_year: data.expYear,
        cvc: data.cvc,
      }, (status:number, response:any) => {
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