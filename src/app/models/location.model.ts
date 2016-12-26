export class LocationModel {
  id: string = null;
  account_id: string = null;
  name: string = null;
  email: string = null;
  fax: string = null;
  street_1: string = null;
  street_2: string = null;
  city: string = null;
  zip_code: string = null;
  image: string = null;

  location_type: string = null;
  phone: string = null;
  updated_at: string = null;
  created_at: string = null;
  state: string = null;
  postal_code: string = null;

  address: any = {};

  formattedAddress: any = null;
  inventory_locations: any = [];
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}