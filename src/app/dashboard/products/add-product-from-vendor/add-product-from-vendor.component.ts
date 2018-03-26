import { Component, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {ProductService} from '../../../core/services/product.service';
import {AccountService} from '../../../core/services/account.service';
import {ProductModel} from '../../../models/product.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-product-from-vendor',
  templateUrl: 'add-product-from-vendor.component.html',
  styleUrls: ['add-product-from-vendor.component.scss']
})

@DestroySubscribers()
export class AddProductFromVendorComponent implements OnInit {
  public subscribers: any = {};

  public step: number = 1;
  public product: ProductModel;
  public variants: any;
  public product_id: any;
  public location_id: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private location: Location
  ) {
  }

  stepAction = (step) => this.step += step;
  checkStep = (step) => this.step == step;

  save() {
    this.productService.addCustomProduct(this.product);
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
        this.product = data.product;
        this.variants = data.variants;
        });
  }

  goBack(): void {
    this.location.back();
  }

}
