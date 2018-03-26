import {Component, OnInit, HostListener} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {includes} from 'lodash';
import {DestroySubscribers} from 'ngx-destroy-subscribers';
import {Router} from '@angular/router';
import {ProductService} from '../../../core/services/product.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-browse-global-market',
  templateUrl: 'browse-global-market.component.html',
  styleUrls: ['browse-global-market.component.scss']
})

@DestroySubscribers()
export class BrowseGlobalMarketComponent implements OnInit {

  public subscribers: any = {};

  public products$: Observable<any> = new Observable();
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject('');
  public isRequest: boolean = false;
  public infiniteScroll$: any = new BehaviorSubject(false);

  constructor(
    private productService: ProductService,
    private router: Router,
    private location: Location
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
          searchKey ? includes(product.name.toLowerCase(), searchKey.toLowerCase()) : product));
  };

  addSubscribers() {

    this.subscribers.infiniteSccrollSubscription = this.infiniteScroll$
      .filter((infinite) => infinite && !this.isRequest)
      .switchMap((infinite) => {
        this.isRequest = true;
        ++this.productService.current_page;
        return this.productService.getNextProducts(this.productService.current_page);
        })
      .subscribe();

    this.subscribers.isDataLoadedSubscription = this.productService.isDataLoaded$
      .filter(r => r)
      .do(() => this.isRequest = false)
      .delay(1000)
      .subscribe((r) => {
        this.getInfiniteScroll();
      });
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

  onSearchEvent($event) {
    this.searchKey$.next($event);
  }

  selectProduct(product) {
    this.productService.selectedProduct = product;
    this.router.navigate(['/product', 'global', product.id]);
  }

  goBack(): void {
    this.productService.updateMarketplaceData('my');
    this.location.back();
  }

}
