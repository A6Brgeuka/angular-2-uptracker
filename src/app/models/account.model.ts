import {UserModel} from "./user.model";
import {InvoiceModel} from "./invoice.model";
import {AlertSettingModel} from "./alertSetting.model";

export class AccountModel {
  
  id:number = null;
  status:number = null;
  statusString:string = null;
  company:string = null;
  enabled:boolean = null;
  trialPeriodLeft:number = null;
  createdAt:string = null;
  updatedAt:string = null;
  
  alertSetting:AlertSettingModel = new AlertSettingModel();
  invoices:InvoiceModel[] = [];
  users:UserModel[] = [];
  owner:UserModel = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
  
      switch (field) {
        case 'owner':
          this[field] = new UserModel(obj[field]);
          break;
        case 'users':
          obj[field].forEach((value, key) => {
            this[field][key] = new UserModel(value);
          });
          break;
        case 'alertSetting':
          this[field] = new AlertSettingModel(obj[field]);
          break;
      }
    }
  }
}