import { Component, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ProductService} from '../../../core/services/product.service';
import {AccountService} from '../../../core/services/account.service';
import { Location } from '@angular/common';
import {map, includes, some, reject, each, flatten, filter, groupBy, reduce, cloneDeep} from 'lodash';
import {ToasterService} from "../../../core/services/toaster.service";
import {inventoryExample} from "../../../models/inventory.model";

@Component({
  selector: 'app-add-product-from-vendor',
  templateUrl: 'add-product-from-vendor.component.html',
  styleUrls: ['add-product-from-vendor.component.scss']
})

@DestroySubscribers()
export class AddProductFromVendorComponent implements OnInit {
  public subscribers: any = {};

  public step: number = 0;
  public product: any;
  public variants: any;
  public product_id: any;
  public location_id: any;
  public vendorVariants: any;
  public vendorVariantsCopy: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private location: Location,
    private router: Router,
    private toasterService: ToasterService
  ) {
  }

  onSubmit() {
    const product = this.formatProduct(this.product);
    this.productService.addCustomProduct(product)
      .subscribe((product) => {
        this.toasterService.pop('', 'Product successfully added');
        this.productService.addToCollection$.next([product]);
        this.router.navigate(['/products']);
      });
  }

  ngOnInit() {
    Observable.combineLatest(this.accountService.dashboardLocation$, this.route.params)
      .subscribe(([location, params]) => {
          this.product_id = params['id'];
          this.location_id = location ? location['id'] : null; //TODO
          this.getProducts();
        },
        (err: any) => console.log(err));

    this.subscribers.onVendorsChange = this.productService.changeVariants$
      .subscribe(variants => this.updateVendors(this.variants));

    /*this.subscribers.onVendorsChange = this.productService.changeVendors$
      .subscribe(() => {
        this.formatVendors(this.variants);
      })*/
  }

  getProducts() {
    this.subscribers.getProductSubscription = this.productService.getProductLocation(this.product_id, this.location_id)
      .filter(res => res.data)
      .map(res => res.data)
      .do(data => {
        this.product = data.product;
        this.variants = data.variants;
        each(data.variants, v => v.checked = true);
      })
      .subscribe(data => this.formatVendors(this.variants));
  }

  formatVendors(variants) {
    const checkedVariants = filter(variants, 'checked');
    const vendors = flatten(map(checkedVariants, 'vendor_variants'));
    const structured = this.structureVariants(vendors);
    this.productService.productVariants = map(checkedVariants, v => this.formatVariants(v));
    this.vendorVariants = map(groupBy(structured, 'vendor_name'), (val, key) => val)
    this.vendorVariantsCopy = cloneDeep(this.vendorVariants);
  };

  updateVendors(variants) {
    //this.vendorVariants = cloneDeep(this.vendorVariantsCopy)
    const checkedVariants = filter(variants, 'checked');
    const checkedVariantsName = map(checkedVariants, 'name');
    this.productService.productVariants = map(checkedVariants, v => this.formatVariants(v));
    each(this.vendorVariants, (vendors, i) => {
      const additional = filter(vendors, 'additional');
      each(additional, (v: any) => v.variants = this.productService.productVariants);

      const rejected = reject(vendors, (vendor: any) => {
        return some(vendor.variants, (variant: any) => {
          return !includes(checkedVariantsName, variant.name);
        });
      });
      rejected.length ? this.vendorVariants[i] = rejected : this.vendorVariants.splice(i, 1);
    });
  }

  formatProduct(product) {
    const attachments = map(product.attachments, 'public_url');
    const vendor_variants = reduce(this.vendorVariants, (result: any[], value) => result.concat(value));
    return {...product, attachments, account_category: "Supplies", vendor_variants};
  }

  structureVariants(vendors) {

    return map(vendors, v => {
      const inventory = [
        {label: v['package_type'], qty: 1},
        {label: v['sub_package'], qty: v['sub_unit_per_package']},
        {label: v['unit_type'], qty: v['units_per_package']}
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
      catalog_number: v['catalog_number'],
      club_price: v['club_price'],
      list_price: v['list_price'],
      our_price: v['our_price'],
      upc: v['upc']
    }
  };

  goBack(): void {
    this.location.back();
  }

}
