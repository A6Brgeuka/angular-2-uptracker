export class AccountVendorModel {
  id: string = null;
  account_id: string = null;
  avg_lead_time: string = null;
  created_at: string = null;
  currency: string = 'USD';
  default_order_type: string = 'email';
  discount_percentage: any = null;
  documents: any = null;
  email: string = null;
  ext_account_number: string = null;
  fax: string = null;
  hidden: boolean = null;
  logo: string = null;
  name: string = null;
  notes: string = null;
  payment_method: string = 'check';
  phone: string = null;
  priority: string = '1';
  product_count: number = 0;
  rep_email: string = null;
  rep_fax: string = null;
  rep_mobile_phone: string = null;
  rep_name: string =  null;
  rep_office_phone: string = null;
  shipping_handling: number = null;
  updated_at: string = null;
  vendor_id: string = null;
  website: string = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
