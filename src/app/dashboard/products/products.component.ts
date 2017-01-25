import {Component, OnInit, ViewContainerRef, HostListener} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

import {Overlay, overlayConfigFactory} from 'angular2-modal';
import {Modal, BSModalContext} from 'angular2-modal/plugins/bootstrap';
import {DestroySubscribers} from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import {ViewProductModal} from './view-product-modal/view-product-modal.component';
import {EditProductModal} from './edit-product-modal/edit-product-modal.component';
import {ProductFilterModal} from './product-filter-modal/product-filter-modal.component';
import {RequestProductModal} from './request-product-modal/request-product-modal.component';
import {ProductService} from '../../core/services/index';
import {ModalWindowService} from "../../core/services/modal-window.service";
import {AccountService} from "../../core/services/account.service";

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
@DestroySubscribers()
export class ProductsComponent implements OnInit {
    private searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public sortBy: string;
    private sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
    public total: number;
    public products$: Observable<any>;
    public dashboardLocation;
    public infiniteScroll$: any = new BehaviorSubject(false);
    private isRequest:boolean = false;
    public searchKey:string;
    public  searchKeyLast: string;
    public  locationId: string;

    constructor(vcRef: ViewContainerRef,
                overlay: Overlay,
                public modal: Modal,
                private productService: ProductService,
                private modalWindowService: ModalWindowService,
                private accountService: AccountService) {
        overlay.defaultViewContainer = vcRef;
    }

    ngOnInit() {

        this.productService.isDataLoaded$
            .delay(500)
            .filter(r=>r)
            .subscribe((r)=>{
                this.isRequest = false;
                this.getInfiniteScroll()
            });

        this.searchKey$.debounceTime(1000)
            .filter(r => r)
            .subscribe(
                (r) => {
                    this.productService.getNextProducts(false, r, this.sortBy);
                    this.productService.current_page = 1;
                }
            );
        this.sortBy$
            .filter(r => r)
            .subscribe(
                (r) => {
                    this.productService.getNextProducts(this.productService.current_page, this.searchKey, r);
                    this.productService.current_page = 1;
                }
            );

        let products$ = this.accountService.dashboardLocation$.filter(res => res).switchMap(location => {
            this.dashboardLocation = location;
            this.productService.location$.next(location);
            this.productService.location=location;
            return this.productService.getProductsLocation(location.id)
        });

        this.products$ = Observable
            .combineLatest(
                // this.productService.products$,
                products$,
                this.sortBy$,
                this.searchKey$
            )
            .map(([products, sortBy, searchKey]: [any, any, any]) => {
                this.total = products.length;
                let filteredProducts: any = products;

                // this.viewProductModal(products[0]);

                // if (searchKey && searchKey != '') {
                //     filteredProducts = _.reject(filteredProducts, (product: any) => {
                //         let key = new RegExp(searchKey, 'i');
                //         return !key.test(product.name);
                //     });
                // }
                // let order = 'desc';
                // if (sortBy == 'A-Z') {
                //     sortBy = 'name';
                //     order = 'asc';
                // }
                // if (sortBy == 'Z-A') {
                //     sortBy = 'name';
                // }

                // let sortedProducts = _.orderBy(filteredProducts, [sortBy], [order]);
                return filteredProducts;
            });


        this.infiniteScroll$
            .withLatestFrom(this.products$)
            .filter(([infinite,products]) =>  {
                return infinite && !this.isRequest && products.length
            })
            .switchMap((infinite) => {
                this.isRequest = true;
                if (this.searchKey == this.searchKeyLast) {
                    ++this.productService.current_page;
                }
                this.searchKeyLast = this.searchKey;
                //TODO remove
                if (this.total <= (this.productService.current_page-1) * this.productService.pagination_limit) {
                    this.productService.current_page = -1; //end reached
                    return false;
                } else {
                    return this.productService.getNextProducts(this.productService.current_page, this.searchKey, this.sortBy);
                }
            })
            .subscribe(res => {

                this.isRequest = false;
            }, err => {

                this.isRequest = false;
            });
    }

    viewProductModal(product) {
        product = Object.assign(product, {location_id: this.dashboardLocation.id});
        this.modal
            .open(ViewProductModal, this.modalWindowService.overlayConfigFactoryWithParams({product: product}))
            .then((resultPromise) => {
                resultPromise.result.then(
                    (res) => {
                        this.editProductModal(res);
                    },
                    (err) => {
                    }
                );
            });
    }

    editProductModal(product = null) {
        this.modal.open(EditProductModal, this.modalWindowService.overlayConfigFactoryWithParams({product: product}));
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

    showFiltersModal() {
        this.modal
            .open(ProductFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
            .then((resultPromise) => {
                resultPromise.result.then(
                    (res) => {
                        // this.filterProducts();
                    },
                    (err) => {
                    }
                );
            });
    }

    requestProduct() {
        this.modal
            .open(RequestProductModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
            .then((resultPromise) => {
                resultPromise.result.then(
                    (res) => {
                        // this.filterProducts();
                    },
                    (err) => {
                    }
                );
            });
    }

    getInfiniteScroll() {
        let toBottom = document.body.scrollHeight - document.body.scrollTop - window.innerHeight;
        // console.log('toBottom',toBottom);
        let scrollBottom = toBottom < 285;
        this.infiniteScroll$.next(scrollBottom);
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        this.getInfiniteScroll();
    }

}
