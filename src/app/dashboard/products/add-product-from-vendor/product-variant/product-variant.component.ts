import {Component, OnInit, Input} from '@angular/core';
import {each, keys, pickBy} from 'lodash';

@Component({
  selector: 'app-product-variant',
  templateUrl: 'product-variant.component.html',
  styleUrls: ['product-variant.component.scss']
})
export class ProductVariantComponent implements OnInit {
  public selected = {};
  @Input("vendor") public vendor;

  @Input()
  set selectAll(val: boolean) {
    each(keys(this.selected), (key) => {
      this.selected[key] = val
    });
  }

  @Input()
  set fillAll(model: any) {
    each(keys(pickBy(this.selected)), (varKey) =>
      each(keys(model), (key) => {
        each(this.vendor.variants, (variant) => {
          if (variant.name == varKey) {
            variant[key] = model[key]
          }
        })
    }))
  }

  constructor() {
  }

  ngOnInit() {
    each(this.vendor.variants, (variant) => {
      this.selected[variant.name] = false
    });
  }


}
