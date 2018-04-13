import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {each, sortBy, times, every} from 'lodash';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {InventoryService} from '../../../core/services/inventory.service';
import {Observable} from 'rxjs';
import {InventorySearchResults, PackageModel} from '../../../models/inventory.model';
import {DestroySubscribers} from 'ngx-destroy-subscribers';

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

  constructor(public inventoryService: InventoryService) {
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
    const pack = times(3, () => new PackageModel());
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

  packageSummary(pack): string {
    if (every(pack, 'label'))
      return `${pack[0].label} of ${pack[1].qty} ${pack[1].label} of ${pack[2].qty} ${pack[2].label} in tcu`;
  }

}
