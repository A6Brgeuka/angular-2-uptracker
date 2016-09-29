export class CreditCardModel {
  id: number = null;
  expMonth: number = null;
  expYear: number = null;
  cvc: number = null;
  cardNumber: number = null;
  city: string = null;
  zip: string = null;
  stripe_token: string = null;
  country: string = null;
  brand: string = null;
  lastNumbers: string = null;
  
  // customer: string = null;
  // name: string = null;
  // street: string = null;
  // state: string = null;
  // isDefault: boolean = false;
  // status: number = null;
  // statusString: string = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}