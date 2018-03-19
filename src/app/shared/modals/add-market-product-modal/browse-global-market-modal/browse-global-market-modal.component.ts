import {Component, OnInit, HostListener} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProductService } from '../../../../core/services/product.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, Modal } from 'angular2-modal';
import { AddProductFromVendorModalComponent } from '../add-product-from-vendor-modal/add-product-from-vendor.component';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {includes} from 'lodash';
import {DestroySubscribers} from "ngx-destroy-subscribers";

export class BrowseGlobalMarketModalContext extends BSModalContext {

}

@Component({
  selector: 'app-browse-global-market-modal',
  templateUrl: 'browse-global-market-modal.component.html',
  styleUrls: ['browse-global-market-modal.component.scss']
})

@DestroySubscribers()
export class BrowseGlobalMarketModalComponent implements OnInit {

  public subscribers: any = {};

  public collection$: BehaviorSubject<any> = new BehaviorSubject([]);
  public products$: Observable<any> = new Observable();
  public products: any = [];
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject('');
  public isRequest: boolean = false;
  public total: number;
  public params: any = {
    page: 1,
    limit: 0
  };

  constructor(
    public productService: ProductService,
    public dialog: DialogRef<BrowseGlobalMarketModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {
    dialog.setCloseGuard(this);
  }

  reachYEnd() {
    this.params.limit+=10;
    this.productService.getGlobalProducts(this.params)
      .subscribe(res => this.collection$.next(res));
  }

  ngOnInit() {
    this.products$ = Observable
      .combineLatest(
        this.collection$,
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
    this.dismissModal();
    this.modal
      .open(AddProductFromVendorModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({product}, true, 'big'));
  }

  dismissModal() {
    this.dialog.dismiss();
  }

}
