export class StorageLocationModel {
  storage_location_is: string = '';
  qty: '';
  
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
  primary_status: boolean = true;
  
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
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}