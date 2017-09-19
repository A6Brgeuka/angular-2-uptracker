export class StorageLocationModel {
  storage_location_is: string = '';
  qty: string = '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class StatusModel {
  type: string = '';
  qty: number = null;
  primary_status: boolean = false;
  showStatusSelect: boolean = true;
  location_name: string = '';
  location_id: string = '';
  tmp_id: string = '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class ItemModel {
  item_id: string = '';
  status: StatusModel[] = [];
  inventory_group_id: string = '';
  location_id: string = '';
  storage_locations: StorageLocationModel[] =[];
  
  quantity: string = '';
  item_name: string = '';
  location_name: string = '';
  existInvGroup: boolean = false;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class OrderModel {
  order_id: string = '';
  items: ItemModel[] = [];
  po_number: string = '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class ReceiveProductsModel {
  orders: OrderModel[] = [];
  packing_slip: string = '';
  invoice_number: '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}