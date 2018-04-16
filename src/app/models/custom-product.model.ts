import {PackageModel} from "./inventory.model";
export class CustomProductModel {
  name: string = null;
  catalog_number: string = null;
  inventory_by: PackageModel[][] = [];
  upc: string = null;
  list_price: number = null;
  club_price: number = null;
  negotiated_price: number = null;
  vendors: any[] = [];
  custom_product: boolean = true;
  manufacturer: string = null;
  mfg_number: string|number = '';

  image: string = null;
  attachments: any[] = [];
  technical_name: string = null;
  hazardous: boolean = null;
  trackable: boolean = null;
  tax_exempt: boolean = null;
  department: string = 'Clinic';
  category: string = null;
  notes: string = null;
  accounting_category: string = 'Supplies: Clinical';
  vendor_variants: any[] = [];
  inventory_group: string = null;

  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class CustomProductVariantModel {
  catalog_number: number | string  = null;
  list_price: string = null;
  our_price: string = null;
  club_price: string = 'N/A';
  barcode: any = null;
  enabled: boolean = false;
}
