import {Injectable} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {inventoryExample} from "../../models/inventory.model";
import {map, findIndex, each, cloneDeep} from 'lodash';

@Injectable()
export class AddProductManager {
  public changeVariants$: Subject<any> = new Subject<any>();
  public productVariantsArr: any;
  public additionalVariantsArr: any = [];

  constructor() {}

  set productVariants(variants) {
    this.productVariantsArr = each(variants, (v: any) => delete v.upc);
  }

  get productVariants() {
    return cloneDeep(this.productVariantsArr);
  }

  structureVariants(vendors) {

    return map(vendors, v => {
      const inventory = [
        {label: v['package_type'], qty: 1},
        {label: v['sub_package'], qty: v['sub_package_per_package'] ? v['sub_package_per_package'] : null},
        {label: v['unit_type'], qty: v['units_per_sub_package'] || v['units_per_package'], units_per_package: v['units_per_package']}
      ];
      //TODO: Define never[]
      const inventory_by = [map(inventory, (inv, i) => {
        return {...inventoryExample[i], ...inv};
      })];
      const vendor = {
        vendor_name: v['vendor_name'],
        vendor_id: v['vendor_id']
      };
      const variants = [this.formatVariants(v)];

      return {...vendor, inventory_by, variants}
    });
  }

  formatVariants(v: any) {
    return {
      name: v['name'],
      original_name: v['name'],
      catalog_number: v['catalog_number'],
      club_price: v['club_price'],
      list_price: v['price'],
      our_price: v['your_price'],
      upc: v['upc'],
      mfg_number: v['mfg_number']
    }
  };

  additionalVariantsAdd(v) {
    this.additionalVariantsArr.push(v);
  }

  additionalVariantsRemove(v) {
    const index = findIndex(this.additionalVariantsArr, {vendor_name: v.vendor_name});
    this.additionalVariantsArr.splice(index, 1)
  }
}
