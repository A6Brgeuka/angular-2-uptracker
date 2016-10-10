import { CreditCardModel } from './credit-card.model';
import { AccountModel } from './account.model';

export class UserModel {
  id: string = null;
  name: string = null;
  email_address: string = null;
  password: string = null;
  
  locations: any = [];
  permissions: any = [];
  phone: string = null;
  account_id: string = null;
  signup: boolean = null; // for SelfDataActions in user.service to avoid putting user_id in cookies (for isGuest functionality)

  cards: CreditCardModel[] = [];
  defaultCard: CreditCardModel = null;
  account: AccountModel = new AccountModel();
  
  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}