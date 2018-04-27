import { Component, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ProductService} from '../../../core/services/product.service';
import {AccountService} from '../../../core/services/account.service';
import { Location } from '@angular/common';
import {map, includes, some, reject, each, flatten, filter, groupBy, cloneDeep} from 'lodash';
import {ToasterService} from "../../../core/services/toaster.service";
import {AddProductManager} from "../../../core/services/add-product.manager";

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
    private toasterService: ToasterService,
    private productManager: AddProductManager
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

  canProceed() {
    if (this.product)
      return this.product.name && this.product.category;
  }

  ngOnInit() {
    Observable.combineLatest(this.accountService.dashboardLocation$, this.route.params)
      .subscribe(([location, params]) => {
          this.product_id = params['id'];
          this.location_id = location ? location['id'] : null; //TODO
          this.getProducts();
        },
        (err: any) => console.log(err));

    this.subscribers.onVendorsChange = this.productManager.changeVariants$
      .subscribe(() => this.updateVendors(this.variants));
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
    const structured = this.productManager.structureVariants(vendors);
    this.productManager.productVariants = map(checkedVariants, v => this.productManager.formatVariants(v));
    this.vendorVariants = map(groupBy(structured, 'vendor_name'), (val, key) => val);
    this.vendorVariantsCopy = cloneDeep(this.vendorVariants);
  };

  updateVendors(variants) {
    this.vendorVariants = cloneDeep(this.vendorVariantsCopy);
    const checkedVariants = filter(variants, 'checked');
    const checkedVariantsName = map(checkedVariants, 'name');
    this.productManager.productVariants = map(checkedVariants, v => this.productManager.formatVariants(v));
    each(this.vendorVariants, (vendors, i) => {
      const rejected = reject(vendors, (vendor: any) => {
        return some(vendor.variants, (variant: any) => {
          return !includes(checkedVariantsName, variant.name);
        });
      });
      rejected.length ? this.vendorVariants[i] = rejected : this.vendorVariants.splice(i, 1);
    });

    each(this.productManager.additionalVariantsArr, (v: any) => {
      v.variants = this.productManager.productVariants;

      const isExists = some(this.vendorVariants, (vendors: any, i) => {
        if (v.vendor_name == vendors[0].vendor_name) {
          this.vendorVariants[i].unshift(cloneDeep(v));
          return true;
        }
      });
      if (!isExists) this.vendorVariants.unshift([cloneDeep(v)]);
    });
  }

  formatProduct(product) {
    const attachments = map(product.attachments, 'public_url');
    const vendor_variants = flatten(this.vendorVariants);
    return {...product, attachments, account_category: "Supplies", vendor_variants, custom: false};
  }

  goBack(): void {
    this.location.back();
  }

}
