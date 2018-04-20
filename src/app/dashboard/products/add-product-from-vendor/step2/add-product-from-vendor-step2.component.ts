import {Component, Input, OnInit, NgZone, ChangeDetectorRef} from '@angular/core';
import {Modal} from 'angular2-modal';
import {ModalWindowService} from '../../../../core/services/modal-window.service';
import {map, clone} from 'lodash';
import {PackageModel, inventoryExample} from "../../../../models/inventory.model";
import {CustomProductVariantModel} from "../../../../models/custom-product.model";
import {AddVendorModalComponent} from "../../../../shared/modals/add-vendor-modal/add-vendor-modal.component";
import {Observable, BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-add-product-from-vendor-step2',
  templateUrl: 'add-product-from-vendor-step2.component.html',
  styleUrls: ['add-product-from-vendor-step2.component.scss']
})
export class AddProductFromVendorStep2Component implements OnInit{

  @Input('product') public product: any;
  @Input('vendorVariants') public vendorVariants: any;
  public vendorVariants$: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService) {
  }

  ngOnInit() {
    this.vendorVariants$.next(this.vendorVariants);
  }

  onVendorChosen(vendorInfo) {
    const variants = [new CustomProductVariantModel({name: this.product.name})];
    const inventory_by = [map(inventoryExample, (inv) => new PackageModel(inv))];
    const vendor = {...vendorInfo, inventory_by, variants};
    this.vendorVariants[vendor['vendor_name']] = this.vendorVariants[vendor['vendor_name']] || [];
    this.vendorVariants[vendor['vendor_name']].unshift(vendor);
    this.vendorVariants$.next(clone(this.vendorVariants));
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
