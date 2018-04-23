import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {every, sortBy} from 'lodash';
import {CustomProductVariantModel} from "../../../../models/custom-product.model";
import {InventoryService} from "../../../../core/services/inventory.service";
import {BehaviorSubject, Observable} from "rxjs";
import {DestroySubscribers} from "ngx-destroy-subscribers";

@Component({
  selector: 'app-vendor-product-package',
  templateUrl: 'vendor-product-package.component.html',
  styleUrls: ['vendor-product-package.component.scss']
})

@DestroySubscribers()
export class VendorProductPackageComponent implements OnInit {

  @Input('package') public package: any;
  @Output('fillColumn') fillColumn = new EventEmitter();
  @Output('fillAll') fillAll = new EventEmitter();

  public subscribers: any = {};
  public mainPrices: any = new CustomProductVariantModel();
  public autocompletePackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompletePackage: any = [];

  constructor(public inventoryService: InventoryService) {
  }

  ngOnInit() {
    this.autocompletePackage$.next('');
  }

  addSubscribers() {
    this.subscribers.autocompleteOuterPackSubscription = this.autocompletePackage$
      .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key))
      .subscribe((pack: any) => this.autocompletePackage = sortBy(pack, ['unit_name']));
  }

  observableSourcePackage(keyword: any) {
    return Observable.of(this.autocompletePackage).take(1);
  }

  onSearchPackage(event) {
    this.autocompletePackage$.next(event.target.value);
  }

  onFillAll(price: string) {
    this.mainPrices.our_price = price;
    this.fillAll.emit(price);
  }

  onFillColumn(prop, value) {
    this.fillColumn.emit({prop, value});
  }

  packageSummary(pack): string {
    const inner = `of ${pack[1].qty} ${pack[1].label}`;
    return `1 ${pack[0].label} ${pack[1].label && pack[1].qty ? inner : ''} of ${pack[2].qty} ${pack[2].label}`;
  }
}
