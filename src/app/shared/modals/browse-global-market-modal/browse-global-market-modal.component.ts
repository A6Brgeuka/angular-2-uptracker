import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProductService } from '../../../core/services/product.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef } from 'angular2-modal';

import * as _ from 'lodash';

export class BrowseGlobalMarketModalContext extends BSModalContext {

}

@Component({
  selector: 'app-browse-global-market-modal',
  templateUrl: './browse-global-market-modal.component.html',
  styleUrls: ['browse-global-market-modal.component.scss']
})
export class BrowseGlobalMarketModalComponent implements OnInit {

  public products$: Observable<any>;
  public sortBy: string = 'A-Z';

  constructor(
    public productService: ProductService,
    public dialog: DialogRef<BrowseGlobalMarketModalContext>,
  ) {

  }

  ngOnInit() {
    this.productService.updateMarketplaceData('global');

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

  dismissModal() {
    this.dialog.dismiss();
  }

}
