import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {each, sortBy} from 'lodash';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {InventoryService} from '../../../core/services/inventory.service';
import {Observable} from 'rxjs';
import {InventorySearchResults} from '../../../models/inventory.model';
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
  public autocompleteOuterPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteOuterPackage: any = [];
  public autocompleteInnerPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteInnerPackage: any = [];
  public autocompleteConsPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteConsPackage: any = [];
  public packages: any[] = [{}];

  constructor(public inventoryService: InventoryService) {
  }

  ngOnInit() {
    each(this.vendor.variants, (variant) => {
      this.selected[variant.name] = false
    });
    this.autocompleteOuterPackage$.next('');
    this.autocompleteInnerPackage$.next('');
    this.autocompleteConsPackage$.next('');
  }

  addSubscribers() {
    this.subscribers.autocompleteOuterPackSubscription = this.autocompleteOuterPackage$
      .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
      .subscribe((pack: any) => this.autocompleteOuterPackage = sortBy(pack, ['unit_name']));

    this.subscribers.autocompleteInnerPackSubscription = this.autocompleteInnerPackage$
      .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
      .subscribe((pack: any) => this.autocompleteInnerPackage = sortBy(pack, ['plural_unit_name']));

    this.subscribers.autocompleteConsPackSubscription = this.autocompleteConsPackage$
      .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
      .subscribe((pack: any) => (this.autocompleteConsPackage = pack) && console.log(pack));
  }

  selectedAutocompledOuterPackage(outerPackage) {
    this.product.package_type = outerPackage.unit_name;
  }
  onSearchOuterPackage(event) {
    this.autocompleteOuterPackage$.next(event.target.value);
  }
  observableSourceOuterPackage(keyword: any) {
    return Observable.of(this.autocompleteOuterPackage).take(1);
  }

  updateOuterPackege(event) {
    /*this.outerPack = (this.product.package_type === event.target.value) ? this.product.package_type : null;
    if (!this.outerPack) {
      this.autocompleteOuterPackage$.next('');
    }*/
    this.autocompleteOuterPackage$.next('');
  }

  selectedAutocompledInnerPackage(innerPackage) {
    this.product.sub_package.properties.unit_type = innerPackage.plural_unit_name;
  }
  onSearchInnerPackage(event) {
    this.autocompleteInnerPackage$.next(event.target.value);
  }
  observableSourceInnerPackage(keyword: any) {
    return Observable.of(this.autocompleteInnerPackage).take(1);
  }
  updateInnerPackege(event) {
    /*this.innerPack = (this.newProductData.sub_package.properties.unit_type === event.target.value) ? this.newProductData.sub_package.properties.unit_type : null;
    if (!this.innerPack) {
      this.autocompleteInnerPackage$.next('');
    }*/
    this.autocompleteInnerPackage$.next('');
  }
  selectedAutocompledConsPackage(consPackage) {
    this.product.consumable_unit.properties.unit_type = consPackage.unit_name ? consPackage.unit_name : consPackage;
  }
  onSearchConsPackage(event) {
    /*this.packDirty = true;*/
    this.product.consumable_unit.properties.unit_type = event.target.value;
    this.autocompleteConsPackage$.next(event.target.value);
  }
  observableSourceConsPackage(keyword: any) {
    return Observable.of(this.autocompleteConsPackage).take(1);
  }

  addPackage() {
    this.packages.push({});
  }

  deletePackage(i) {
    this.packages.splice(i, 1);
    if (!this.packages.length) {
      this.vendorDelete.emit();
    }
  }

  selectAll() {
    each(this.selected, (val, key) => {
      this.selected[key] = this.selected.all
    });
  }

}
