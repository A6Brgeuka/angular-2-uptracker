export class InventoryProductModel {
  product_id:"";
  variant_id:"";
  vendor_name:null;
  vendor_id:null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class InventoryStorageLocationModel {
  name: string = '';
  inventory_location_id: string = '';
  on_hand: number = 0;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class InventoryLocationModel {
  name: string = '';
  location_id: string = '';
  critical_level: number = 0;
  fully_stocked: number = 0;
  overstock_level: number = 0;
  tracking_method: string = '';
  auto_reorder_start_date = null;
  auto_reorder_frequency = 1;
  auto_reorder_timespan = null;
  auto_reorder_qty = null;
  storage_locations: InventoryStorageLocationModel[] = [];
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class InventoryModel {
  name: string = '';
  products: InventoryProductModel[] = [];
  department: string = '';
  category: string = '';
  account_category: string = '';
  tax_exempt: boolean = false;
  trackable: boolean = false;
  description: string = '';
  notes: string = '';
  msds = [];
  attachments = [];
  image: string = '';
  locations: InventoryLocationModel[] =[];
  inventory_by: string = '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}



//a  = new InventoryModel();
//a.products = elements.map(ff => new ProductModel());