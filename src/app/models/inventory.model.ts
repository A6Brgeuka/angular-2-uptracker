

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

