import {Component, OnInit, HostListener} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProductService } from '../../../core/services/product.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, Modal } from 'angular2-modal';
import { AddProductFromVendorModalComponent } from '../add-product-from-vendor-modal/add-product-from-vendor.component';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

import {DestroySubscribers} from "ngx-destroy-subscribers";

export class BrowseGlobalMarketModalContext extends BSModalContext {

}

@Component({
  selector: 'app-browse-global-market-modal',
  templateUrl: './browse-global-market-modal.component.html',
  styleUrls: ['browse-global-market-modal.component.scss']
})

@DestroySubscribers()
export class BrowseGlobalMarketModalComponent implements OnInit {
  public subscribers: any = {};

  public products$: any;
  public sortBy: string = 'A-Z';
  public infiniteScroll$: any = new BehaviorSubject(false);
  public isRequest: boolean = false;
  public total: number;
  constructor(
    public productService: ProductService,
    public dialog: DialogRef<BrowseGlobalMarketModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {
    dialog.setCloseGuard(this);
  }

  getInfiniteScroll() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let toBottom = document.body.scrollHeight - scrollTop - window.innerHeight;
    let scrollBottom = toBottom < 285;
    this.infiniteScroll$.next(scrollBottom);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.getInfiniteScroll();
  }

  addSubscribers() {
    this.subscribers.infiniteSccrollSubscription = this.infiniteScroll$
      .filter((infinite) => infinite && !this.isRequest)
      .switchMap((infinite) => {

        this.isRequest = true;

        if (this.total <= (this.productService.current_page) * this.productService.pagination_limit) {
          this.isRequest = false;
          return Observable.of(false);
        } else {
          return this.productService.getNextProducts(this.productService.current_page);
        }
      })
      .subscribe(res => {
      }, err => {
        console.log(err);
      });

    this.subscribers.totalCountSubscription = this.productService.totalCount$
      .subscribe(total => this.total = total);
  }

  ngOnInit() {
    this.productService.getNextProducts(1, 'global')
      .subscribe(res => this.products$ = Observable.of(res));
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
