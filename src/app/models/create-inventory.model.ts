export class InventoryProductModel {
  product_id: string = null;
  variant_id: string = null;
  vendor_name: string = null;
  vendor_id: string = null;
  
  name: string = '';
  images: any[] = [];
  vendors: any[] = [];
  
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
  on_hand: number = null;
  floor_stock: boolean = false;
  
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
  critical_level: number = null;
  fully_stocked: number = null;
  overstock_level: number = null;
  tracking_method: string = 'Perpetual';
  auto_reorder_start_date: string = null;
  auto_reorder_frequency: number = 1;
  auto_reorder_timespan: string = 'Month(s)';
  auto_reorder_qty: number = null;
  storage_locations: InventoryStorageLocationModel[] = [];
  active: boolean = false;
  
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
  department: string = 'Administrative';
  category: string = 'Assets';
  account_category: string = 'Supplies';
  tax_exempt: boolean = false;
  trackable: boolean = false;
  description: string = '';
  notes: string = '';
  msds: any[] = [];
  attachments: any[] = [];
  image: string = '';
  locations: InventoryLocationModel[] =[];
  inventory_by: string = 'Consumable Unit';
  package_type:string = null;
  sub_package_type:string = null;
  sub_package_qty:number = null;
  consumable_unit_type:string = null;
  consumable_unit_qty:number = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

