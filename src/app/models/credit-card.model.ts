export class CreditCardModel {
  id: number = null;
  expMonth: number = null;
  expYear: number = null;
  cvc: number = null;
  cardNumber: number = null;
  token: string = null;
  customer: string = null;
  name: string = null;
  street: string = null;
  city: string = null;
  state: string = null;
  zip: string = null;
  country: string = null;
  brand: string = null;
  lastNumbers: string = null;
  isDefault: boolean = false;
  status: number = null;
  statusString: string = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class CardModel {
  id: number = null;
  idUser: number = null;
  token: string = null;
  country: string = null;
  brand: string = null;
  expMonth: number = null;
  expYear: number = null;
  lastNumbers: string = null;
  isDefault: boolean = false;

  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}