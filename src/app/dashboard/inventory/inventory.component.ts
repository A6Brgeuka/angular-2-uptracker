import { Component, OnInit, ViewContainerRef, HostListener, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { ProductService } from '../../core/services/index';
import { ModalWindowService } from "../../core/services/modal-window.service";
import { AccountService } from "../../core/services/account.service";
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
@DestroySubscribers()
export class InventoryComponent implements OnInit {
  @Input('inputRange') inputRange;
  
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string = 'A-Z';
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject('A-Z');
  public total: number;
  public products$: Observable<any>;
  public products: any = [];
  public selectedProducts: any = [];
  
  public infiniteScroll$: any = new BehaviorSubject(false);
  public selectAll$: any = new BehaviorSubject(0);
  public isRequest: boolean = false;
  public searchKey: string;
  public searchKeyLast: string;
  public locationId: string;
  public selectAll: boolean = false;
  public quantityMargin: string = '0';
  
  public quantity: number = 3;
  public maxVal: number = 100;
  public thumbColor: string = "#000000";
  
  constructor(
    public modal: Modal,
    public productService: ProductService,
    public modalWindowService: ModalWindowService,
    public accountService: AccountService,
    public toasterService: ToasterService
  ) {
  }
  
  toggleView() {
    this.productService.isGrid = !this.productService.isGrid;
    
  }
  
  toggleSelectAll(event) {
    // 0 = unused, 1 = selectAll, 2 = deselectAll
    this.selectAll$.next(event ? 1 : 2);
    this.onCheck();
  }
  
  ngOnInit() {
    this.calcQuantityMargin(3);
    
    this.accountService.dashboardLocation$.subscribe((loc: any) => {
      this.locationId = loc ? loc['id'] : '';
    });
    
    this.productService.totalCount$.subscribe(total => this.total = total);
    
    this.productService.isDataLoaded$
    .filter(r => r)
    .subscribe((r) => {
      this.isRequest = false;
      this.getInfiniteScroll();
    });
    
    this.searchKey$.debounceTime(1000)
    .filter(r => (r || r === ''))
    .subscribe(
      (r) => {
        this.searchKey = r;
        this.productService.current_page = 0;
        this.productService.getNextProducts(0, r, this.sortBy).subscribe((r) => {
            this.getInfiniteScroll();
          }
        );
      }
    );
    
    
    this.searchKey$
    .subscribe(
      (r) => {
        if (r && this.sortBy == "A-Z") {
          this.sortBy$.next("relevance");
        } else if (!r && this.sortBy === "relevance") {
          this.sortBy$.next("A-Z");
        }
      });
    
    this.sortBy$.subscribe((sb: string) => {
      this.sortBy = sb;
    });
    
    this.sortBy$
    .filter(r => r)
    .subscribe(
      (r) => {
        this.productService.getNextProducts(this.productService.current_page, this.searchKey, r);
        this.productService.current_page = 1;
      }
    );
    
    this.products$ = Observable
    .combineLatest(
      this.productService.collection$,
      this.sortBy$,
      this.searchKey$,
      this.selectAll$
    )
    .map(([products, sortBy, searchKey, selectAll]: [any, any, any, any]) => {
      for (let p of products) {
        (selectAll === 1) ? p.selected = true : p.selected = false;
      }
      products.map((item: any) => {
          if (!item.image && !_.isEmpty(item.images)) {
            item.image = item.images[0];
          }
          return item;
        }
      );
      return products;
    });
    
    this.productService.collection$.subscribe(r => this.products = r);
    
    Observable.combineLatest(this.infiniteScroll$, this.products$)
    //.debounceTime(100)
    .filter(([infinite, products]) => {
      return (infinite && !this.isRequest && products.length);
    })
    .switchMap(([infinite, products]) => {
      this.isRequest = true;
      
      this.searchKeyLast = this.searchKey;
      //TODO remove
      if (this.total <= (this.productService.current_page - 1) * this.productService.pagination_limit) {
        this.isRequest = false;
        return Observable.of(false);
      } else {
        if (this.searchKey == this.searchKeyLast) {
          ++this.productService.current_page;
        }
        return this.productService.getNextProducts(this.productService.current_page, this.searchKey, this.sortBy);
      }
    })
    .subscribe(res => {
    }, err => {
    
    });
  }
  
  toggleProductVisibility(product) {
    product.status = !product.status;
    //TODO add save to server
  }
  
  
  searchFilter(event) {
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }
  
  itemsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }
  
  getInfiniteScroll() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    let toBottom = document.body.scrollHeight - scrollTop - window.innerHeight;
    // console.log('toBottom',toBottom);
    let scrollBottom = toBottom < 285;
    this.infiniteScroll$.next(scrollBottom);
  }
  
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.getInfiniteScroll();
  }
  
  onCheck() {
    this.selectedProducts = _.cloneDeep(this.products)
    .filter(r => r['selected']);
  }
  
  
  addToFavorites(e, product) {
    e.stopPropagation();
    this.setFavorite(product, true);
  }
  
  removeFromFavorites(e, product) {
    e.stopPropagation();
    this.setFavorite(product, false);
  }
  
  setFavorite(product, val: boolean) {
    product.favorite = val;
    let updateData: any = {
      location_id: this.locationId,
      product: {
        id: product.id,
        favorite: val
      },
      variants: [],
    };
    let updateProduct$ = this.productService.updateProduct(updateData);
    updateProduct$.subscribe((r) => {
      console.log(r);
      this.toasterService.pop('', val ? 'Added to favorites' : "Removed from favorites");
    })
  }
  
  resetFilters() {
    this.searchKey = '';
    this.sortBy = '';
    this.productService.current_page = 0;
    this.productService.getNextProducts(0, this.searchKey, this.sortBy).subscribe((r) => {
        this.getInfiniteScroll();
      }
    );
  }
  
  
  calcQuantityMargin(value: number) {
    this.quantityMargin = 'calc(' + ((value - 1) * 100 / (this.maxVal - 1)).toString() + '% - 16px)';
    this.thumbColor = this.calcThumbColor(value / this.maxVal);
  }
  
  changeValue(event, product) {
    let value = event.target.value || 0;
    this.calcQuantityMargin(value);
  }
  
  private calcThumbColor(number: number) {

    let value = Math.min(Math.max(0,number), 1) * 510;
  
    let redValue;
    let greenValue;
    if (value < 255) {
      redValue = 255;
      greenValue = Math.sqrt(value) * 16;
      greenValue = Math.round(greenValue);
    } else {
      greenValue = 255;
      value = value - 255;
      redValue = 255 - (value * value / 255);
      redValue = Math.round(redValue);
    }
    
    return this.rgb2hex(redValue*.9,greenValue*.9,0);
  }
  
  private rgb2hex(red, green, blue) {
    let rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }
  
  
}