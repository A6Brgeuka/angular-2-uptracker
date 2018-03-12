import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProductService } from '../../../core/services/product.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-browse-global-market-modal',
  templateUrl: './browse-global-market-modal.component.html',
  styleUrls: ['browse-global-market-modal.component.scss']
})
export class BrowseGlobalMarketModalComponent implements OnInit {

  public products$: Observable<any>;
  public sortBy: string = 'A-Z';

  constructor(public productService: ProductService,) { }

  ngOnInit() {

    this.products$ = Observable
      .combineLatest(
        this.productService.collection$,
        this.productService.sortBy$,
        this.productService.searchKey$
      )
      .map(([products, sortBy, searchKey, selectAll]: [any, any, any, any]) => {
        this.sortBy = sortBy;
        products.map((item: any) => {
            if (!item.image && !_.isEmpty(item.images)) {
              item.image = item.images[0];
            }
            return item;
          }
        );
        return products;
      });
  }

}
