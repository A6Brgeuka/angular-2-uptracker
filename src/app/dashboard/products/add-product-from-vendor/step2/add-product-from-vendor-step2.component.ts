import {Component, Input} from '@angular/core';
import {Modal} from 'angular2-modal';
import {ModalWindowService} from '../../../../core/services/modal-window.service';
import {map, findIndex, cloneDeep} from 'lodash';
import {PackageModel, inventoryExample} from "../../../../models/inventory.model";
import {AddVendorModalComponent} from "../../../../shared/modals/add-vendor-modal/add-vendor-modal.component";
import {AddProductManager} from "../../../../core/services/add-product.manager";

@Component({
  selector: 'app-add-product-from-vendor-step2',
  templateUrl: 'add-product-from-vendor-step2.component.html',
  styleUrls: ['add-product-from-vendor-step2.component.scss']
})
export class AddProductFromVendorStep2Component {

  @Input('product') public product: any;
  @Input('vendorVariants') public vendorVariants: any;

  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    private productManager: AddProductManager) {
  }

  onVendorChosen(vendorInfo) {
    const vendor = this.createVendor(vendorInfo);
    this.productManager.additionalVariantsAdd(vendor);
    const i = findIndex(this.vendorVariants, (arr) => arr[0].vendor_name == vendor['vendor_name']);
    i > -1 ? this.vendorVariants[i].unshift(vendor) : this.vendorVariants.unshift([vendor]);
  }

  onVendorDelete(i) {
    this.vendorVariants.splice(i, 1);
  }

  createVendor(vendorInfo) {
    const variants = this.productManager.productVariants;
    const inventory_by = [map(inventoryExample, (inv) => new PackageModel(inv))];
    return {...vendorInfo, inventory_by, variants, additional: true}; //TODO implement in better way (additional)
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
