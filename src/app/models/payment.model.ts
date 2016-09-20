import {CardModel} from "./credit-card.model";

export class PaymentModel {
  id:number;
  idCard:string;
  status:string;
  idCharge:string;
  currency:number;
  fee:number;
  amount:number;
  createdAt:string;
  updatedAt:string;
  
  card: CardModel;
  
  constructor(obj?: any) {
    this.id                 = obj && obj.id                || null;
    this.status             = obj && obj.status            || null;
    this.idCharge           = obj && obj.idCharge          || null;
    this.currency           = obj && obj.currency          || null;
    this.fee                = obj && obj.fee               || null;
    this.amount             = obj && obj.amount            || null;
    this.createdAt          = obj && obj.createdAt         || null;
    this.updatedAt          = obj && obj.updatedAt         || null;
  
    this.idCard             = obj && obj.idCard            || null;
    this.card               = obj && obj.card              || null;
  }
}