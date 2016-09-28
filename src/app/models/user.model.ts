// import { TokenModel } from './token.model';
import { CreditCardModel } from './credit-card.model';
import { AccountModel } from './account.model';

export class UserModel {
  id: number = null;
  name: string = null;
  email_address: string = null;
  password: string = null;
  
  locations: any = [];
  permissions: any = [];
  phone: number = null;
  account_id: number = null;

  // smsToNumber: number = null;
  // typeAuthenticationString: string = 'default';
  // role: string = null;
  // roleString: string = null;
  // status: number = null;
  // statusString: string = null;
  // idAccount: number = null;
  // trialPeriodLeft: number = null;

  // tokens: TokenModel[] = [];
  cards: CreditCardModel[] = [];
  defaultCard: CreditCardModel = null;
  account: AccountModel = new AccountModel();
  // deployments: DeploymentModel[] = [];
  
  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];

    //     switch (field) {
    //       case 'account':
    //         this[field] = new AccountModel(obj[field]);
    //         break;
    //       case 'cards':
    //         obj[field] = obj[field].filter(res => {
    //           return res.statusString == "active";
    //         });
    //
    //         obj[field].forEach((value, key) => {
    //           this[field][key] = new CreditCardModel(value);
    //         });
    //
    //         break;
    //     }
      }
    }
  }
}