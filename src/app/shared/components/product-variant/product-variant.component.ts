import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {each, sortBy, map, every, clone} from 'lodash';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {InventoryService} from '../../../core/services/inventory.service';
import {Observable} from 'rxjs';
import {InventorySearchResults, PackageModel} from '../../../models/inventory.model';
import {DestroySubscribers} from 'ngx-destroy-subscribers';
import {CustomProductVariantModel} from "../../../models/custom-product.model";
const dummyInventory = [
  {type: 'Package', value: 'package'},
  {type: 'Sub Package', value: 'sub_package'},
  {type: 'Consumable Unit', value: 'consumable_unit'}];

@Component({
  selector: 'app-product-variant',
  templateUrl: 'product-variant.component.html',
  styleUrls: ['product-variant.component.scss']
})
@DestroySubscribers()
export class ProductVariantComponent implements OnInit {
  @Input('vendor') public vendor;
  @Output('vendorDelete') public vendorDelete = new EventEmitter();

  public subscribers: any = {};
  public product: any = new InventorySearchResults();
  public selected: any = {};
  public autocompletePackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompletePackage: any = [];
  public mainPrices: any = new CustomProductVariantModel();
  /*public createdVariants = clone(this.vendor.variants);*/

  constructor(public inventoryService: InventoryService) {
    console.log(this.vendor)
  }

  ngOnInit() {
    this.autocompletePackage$.next('');
  }

  addSubscribers() {
    this.subscribers.autocompleteOuterPackSubscription = this.autocompletePackage$
      .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
      .subscribe((pack: any) => this.autocompletePackage = sortBy(pack, ['unit_name']));
  }

  observableSourcePackage(keyword: any) {
    return Observable.of(this.autocompletePackage).take(1);
  }

  onSearchPackage(event) {
    this.autocompletePackage$.next(event.target.value);
  }

  addPackage() {
    const pack = map(dummyInventory, (inv) => new PackageModel(inv));
    this.vendor.inventory_by.push(pack);
  }

  deletePackage(i) {
    this.vendor.inventory_by.splice(i, 1);
    if (!this.vendor.inventory_by.length) {
      this.vendorDelete.emit();
    }
  }

  selectAll() {
    each(this.vendor.variants, (v) => {
      v.enabled = this.selected.all
    });
  }

  fillPrices(variant, prop, main) {
    if (prop && main)
      each(this.vendor.variants, (v) => v[prop] = variant[prop]);
    if (prop == 'list_price' && main)
      each(this.vendor.variants, (v) => v[prop] = v['our_price'] = variant[prop]);
    variant.our_price = variant.list_price;
  }

  packageSummary(pack): string {
    if (every(pack, 'label'))
      return `${pack[0].label} of ${pack[1].qty} ${pack[1].label} of ${pack[2].qty} ${pack[2].label} in tcu`;
  }

}
