import {Component, Input} from '@angular/core';
import {Modal} from 'angular2-modal';
import {ModalWindowService} from '../../../../core/services/modal-window.service';
import {map, findIndex} from 'lodash';
import {PackageModel} from "../../../../models/inventory.model";
import {CustomProductVariantModel} from "../../../../models/custom-product.model";
import {AddVendorModalComponent} from "../../../../shared/modals/add-vendor-modal/add-vendor-modal.component";

export const dummyInventory = [
  {type: 'Package', value: 'package', qty: 1},
  {type: 'Sub Package', value: 'sub_package'},
  {type: 'Consumable Unit', value: 'consumable_unit'}
];

@Component({
  selector: 'app-add-product-from-vendor-step2',
  templateUrl: 'add-product-from-vendor-step2.component.html',
  styleUrls: ['add-product-from-vendor-step2.component.scss']
})
export class AddProductFromVendorStep2Component {

  @Input('product') public product: any;

  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService) {
  }

  onVendorChosen(vendorInfo) {
    const variants = [new CustomProductVariantModel({name: this.product.name})];
    const inventory_by = [map(dummyInventory, (inv) => new PackageModel(inv))];
    const vendor = {...vendorInfo, inventory_by, variants};
    if (vendor.additional) {
      const i = findIndex(this.product.vendor_variants, (v) => v['vendor_name'] == vendor['vendor_name']);
      this.product.vendor_variants.splice(i + 1, 0, vendor);
      return;
    }
    this.product.vendor_variants.unshift(vendor);
  }

  onVendorDelete(i) {
    this.product.vendor_variants.splice(i, 1);
  }

  openAddVendorsModal() {
    this.modal
      .open(AddVendorModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({modalMode: true}, true))
      .then((resultPromise) => {
        resultPromise.result.then(
          (vendor) => {
            this.onVendorChosen({vendor_name: vendor.name});
          },
          (err) => {
          }
        );
      });
  }

}
