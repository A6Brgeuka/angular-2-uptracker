import {UserModel} from "./user.model";
// import {InvoiceModel} from "./invoice.model";

export class AccountModel {
  
  id:number = null;
  // status:number = null;
  // statusString:string = null;
  // company:string = null;
  // enabled:boolean = null;
  // trialPeriodLeft:number = null;
  // createdAt:string = null;
  // updatedAt:string = null;
  
  // invoices:InvoiceModel[] = [];
  // users:UserModel[] = [];
  // owner:UserModel = null;

  account_owner: string = null;
  address: any = {};
  // "alert_on_dup_product": true;
  // "allow_multiple_locations": true;
  // "allow_product_nicknames": true;
  // "annual_income": 1000000;
  // "annual_inventory_budget": null;
  // "annual_net_revenue": null;
  // "auto_manage_inventory": false;
  // "bcc_account_email": false;
  // "breakout_products_by_location": false;
  // "cc_account_email": false;
  // "cc_last_four": null;
  // "cc_type": null;
  company_name: string = null;
  // "contact_email_address": "ben@ben.com";
  created_at: string = null;
  created_by: string = null;
  // "currency": "USD";
  // "dashboard_notifications": true;
  // "default_billing_location": "Order Location";
  // "default_order_type": "Email";
  // "default_report_interval": null;
  // "default_shipping_location": "Order Location";
  // "email_verification_token": "57df4df371d08f08fceec701";
  // "email_verified": false;
  // "email_verified_timestamp": null;
  // "fiscal_year": null;
  // "hide_obsolete_supplies": true;
  marys_list_member: boolean = null;
  // "marys_list_pricing": false;
  // "paper_size": "US Letter";
  // "parent_account": null;
  // "payment_token": null;
  // "perpetual_inventory": true;
  // "phone_format": "+1 222-3333";
  // "print_emailed_po": false;
  // "print_non_emailed_po": true;
  // "purchase_order_notes": null;
  // "remember_product_order_qty": false;
  // "req_po_confirmation": true;
  // "scanner_functionality": true;
  // "share_pricing_data": true;
  status: number = null;
  trial_code: string = null;
  // "trial_expiration": null;
  updated_at: string = null;
  // "use_reorder_level": false;
  users: UserModel[] = [];
  
  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    
    //   switch (field) {
    //     case 'owner':
    //       this[field] = new UserModel(obj[field]);
    //       break;
    //     case 'users':
    //       obj[field].forEach((value, key) => {
    //         this[field][key] = new UserModel(value);
    //       });
    //       break;
    //     case 'alertSetting':
    //       this[field] = new AlertSettingModel(obj[field]);
    //       break;
    //   }
    }
  }
}