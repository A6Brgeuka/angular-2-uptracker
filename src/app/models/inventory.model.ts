export class PackageProperties{
  qty:number;
  unit_type:string;
}

export class VendorProperties{
  id:string;
  name:string;
}

export class InventorySearchResults {
  consumable_unit: PackageProperties;
  sub_package: PackageProperties;
  'package': PackageProperties;
  vendor:VendorProperties;
  description:string;
  catalog_number: string;
  club_price:number;
  forum_price:number;
  images:string[];
  mfg_number:string|number;
  name:string;
  package_type:string;
  price:number;
  product_id:string;
  upc:string;
  variant_id:string;
  
  checked:boolean; // my prop
}

export class searchData {
  count:number;
  results:InventorySearchResults[];
}

