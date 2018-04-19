import { Component, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ProductService} from '../../../core/services/product.service';
import {AccountService} from '../../../core/services/account.service';
import { Location } from '@angular/common';
import {map, merge, each, flatten} from 'lodash';
import {ToasterService} from "../../../core/services/toaster.service";

export const dummyInventory = [
  {type: 'Package', value: 'package', qty: 1},
  {type: 'Sub Package', value: 'sub_package'},
  {type: 'Consumable Unit', value: 'consumable_unit'}
  ];

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

  formatProduct(product) {
    const attachments = map(product.attachments, 'public_url');
    return {...product, attachments};
  }

  ngOnInit() {
    Observable.combineLatest(this.accountService.dashboardLocation$, this.route.params)
      .subscribe(([location, params]) => {
          this.product_id = params['id'];
          this.location_id = location ? location['id'] : null; //TODO
          this.getProducts();
        },
        (err: any) => console.log(err));
  }

  getProducts() {
    this.subscribers.getProductSubscription = this.productService.getProductLocation(this.product_id, this.location_id)
      .filter(res => res.data)
      .map(res => res.data)
      .subscribe(data => {
        const vendors = flatten(map(data.variants, 'vendor_variants'));

        const variants = map(vendors, v => {
          const inventory = [
            {label: v['package_type'], qty: 1},
            {label: v['sub_package'], qty: v['sub_unit_per_package'] || ''},
            {label: v['unit_type'], qty: v['units_per_package' || '']}
          ];
          //TODO: Define nest[]
          const inventory_by = [merge(dummyInventory, inventory)];
          const vendor = {
            vendor_name: v['vendor_name'],
            vendor_id: v['vendor_id']
          };
          const variants = [{
            name: v['name'],
            catalog_number: v['catalog_number'],
            club_price: v['club_price'],
            list_price: v['list_price'],
            our_price: v['our_price'],
            upc: v['upc']
          }];

          return {...vendor, inventory_by, variants}
        });

        this.product = {...data.product, account_category:"", vendor_variants: variants};
        this.variants = data.variants;
      });
  }

  goBack(): void {
    this.location.back();
  }

}
