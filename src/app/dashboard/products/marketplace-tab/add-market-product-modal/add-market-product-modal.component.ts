import { Component, OnInit } from '@angular/core';
import {DialogRef, Modal} from 'angular2-modal';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {Observable} from 'rxjs/Observable';
import {DestroySubscribers} from 'ngx-destroy-subscribers';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs/Subject';
import {ProductService} from '../../../../core/services/product.service';
import {isObject} from 'lodash'
import {Router} from "@angular/router";

export class AddMarketProductModalContext extends BSModalContext {

}

@Component({
  selector: 'app-add-product-modal',
  templateUrl: 'add-market-product-modal.component.html',
  styleUrls: ['add-market-product-modal.component.scss']
})

@DestroySubscribers()
export class AddMarketProductModalComponent implements OnInit {
  public subscribers: any = {};

  public searchText: string = '';
  public noSearchedRes: string = null;
  public autocompleteProducts$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteProducts: any =  [];
  public typeIn$: any = new Subject();

  constructor(
    private productService: ProductService,
    private router: Router,
    public dialog: DialogRef<AddMarketProductModalContext>,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {
  }

  ngOnInit() {
  }

  addSubscribers() {
    this.subscribers.autocompleteProductsSubscription = this.autocompleteProducts$
      .switchMap((keywords: string) => this.productService.autocompleteSearchProduct(keywords)).publishReplay(1).refCount()
      .subscribe(res => {
        this.autocompleteProducts = res;
      });
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }

  onSearchTypeIn(event) {
    const requestParams = {
      query: event.target.value,
      page: 1,
      limit: 10
    };
    this.autocompleteProducts$
      .next(requestParams);
    if (event.target.value.length > 2) {
      this.typeIn$.next(event.target.value);
    } else {
      this.typeIn$.next(null);
    }
  }

  listFormatter = (product: any) => product.name;

  onSearchTextUpdated(searchText){
    this.searchText = searchText;
    this.typeIn$.next(searchText);
  }

  selectedAutocompled(product: any) {
    if (isObject(product))
      this.router.navigate(['/product', 'global', product.id]) && this.dismissModal();
  }

  observableSource(keyword: any) {
    return Observable.of(this.autocompleteProducts).take(1);
  }

  onAddCustomClick() {
    this.productService.searchText = this.searchText;
    this.router.navigate(['/product', 'custom']) && this.dismissModal();
  }
}
