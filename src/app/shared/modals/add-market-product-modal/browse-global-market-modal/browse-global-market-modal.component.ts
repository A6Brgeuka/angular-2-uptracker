import {Component, OnInit, HostListener} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProductService } from '../../../../core/services/product.service';
import { Modal } from 'angular2-modal';
import { AddProductFromVendorModalComponent } from '../add-product-from-vendor-modal/add-product-from-vendor.component';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {includes} from 'lodash';
import {DestroySubscribers} from "ngx-destroy-subscribers";

@Component({
  selector: 'app-browse-global-market-modal',
  templateUrl: 'browse-global-market-modal.component.html',
  styleUrls: ['browse-global-market-modal.component.scss']
})

@DestroySubscribers()
export class BrowseGlobalMarketModalComponent implements OnInit {

  public subscribers: any = {};

  public products$: Observable<any> = new Observable();
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject('');
  public isRequest: boolean = false;

  constructor(
    public productService: ProductService,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {}

  ngOnInit() {
    this.productService.updateMarketplaceData('global');
    this.products$ = Observable
      .combineLatest(
        this.productService.collection$,
        this.searchKey$
      )
      .map(([products, searchKey]: [any, any]) =>
        products.filter((product: any) =>
          includes(product.name.toLowerCase(), searchKey.toLowerCase())));
  };

  onSearchEvent($event) {
    this.searchKey$.next($event);
  }

  openAddNewProductFromVendorModal(product) {
    this.modal
      .open(AddProductFromVendorModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({product}, true, 'big'));
  }

}
