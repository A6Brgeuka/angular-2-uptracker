import {Component, OnInit, HostListener, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
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
export class BrowseGlobalMarketComponent implements OnInit, OnDestroy {

  public subscribers: any = {};

  public searchKey: string;
  public isRequest: boolean = false;
  public infiniteScroll$: any = new BehaviorSubject(false);

  constructor(
    public productService: ProductService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.productService.updateMarketplaceData('global');
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

  searchProducts(event) {
    this.productService.updateSearchKey(event);
  }

  selectProduct(product) {
    this.productService.selectedProduct = product;
    this.router.navigate(['/product', 'global', product.id]);
  }

  goBack(): void {
    this.productService.updateMarketplaceData('my');
    this.location.back();
  }

  resetSearch() {
    this.searchKey = '';
    this.productService.updateSearchKey('');
  }

  ngOnDestroy() {
    this.resetSearch();
  }

}
