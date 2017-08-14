

export class PackageProperties{
  properties:Package
}

export class Package{
  qty:number;
  unit_type:string;
}

export class VendorProperties{
  properties:Vendor
}

export class Vendor{
  id:string;
  name:string;
}

export class InventorySearchResults {
  consumable_unit: PackageProperties =  {properties:{qty:null, unit_type:null}};
  sub_package: PackageProperties =  {properties:{qty:null, unit_type:null}};
  'package': PackageProperties =  {properties:{qty:null, unit_type:null}};
  vendor:VendorProperties = {properties:{name:"", id:null}};
  description:string = "";
  catalog_number: string = "";
  club_price:number = 0;
  forum_price:number = 0;
  images:string[] = [];
  mfg_number:string|number = "";
  name:string = "";
  package_type:string = "";
  //price:number = 0;
  product_id:string  = "";
  upc:string = "";
  variant_id:string = "";
  
  checked:boolean = false; // my prop
  
  notActive:boolean = false; // my prop
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class NewInventoryPackage {
  package_type:string = null;
  sub_package_type:string = null;
  sub_package_qty:string = null;
  consumable_unit_type:string = null;
  consumable_unit_qty:string = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class searchData {
  count:number;
  results:InventorySearchResults[];
}

export class AttachmentFiles {
  file_name: string;
  s3_object: string;
  id: string;
  ts: string;
  uri: string;
  type: string;
}

export class NewInventoryStorageLocation {
  name: string = '';
  inventory_location_id: string = '';
  on_hand: number = 0;
}

export class NewInventoryLocation {
  name: string = '';
  location_id: string = '';
  critical_level: number = 0;
  fully_stocked: number = 0;
  overstock_level: number = 0;
  tracking_method: string = '';
  auto_reorder_start_date = null;
  auto_reorder_frequency = null;
  auto_reorder_timespan = null;
  auto_reorder_qty = null;
  storage_locations: NewInventoryStorageLocation[] = [];
}

export class NewInventory {
  name: string = '';
  products: string[] = [];
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
  locations: NewInventoryLocation[] =[];
  inventory_by: string = '';
}
