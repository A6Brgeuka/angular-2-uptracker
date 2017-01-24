import {Injectable, Injector} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import * as _ from 'lodash';
import {Restangular} from 'ng2-restangular';

import {ModelService} from '../../overrides/model.service';
import {UserService} from './user.service';
import {AccountService} from './account.service';
import {Subscribers} from '../../decorators/subscribers.decorator';
import {ProductModel} from '../../models/index';
import {BehaviorSubject} from "rxjs";

@Injectable()
@Subscribers({
    initFunc: 'onInit',
    destroyFunc: null,
})
export class ProductService extends ModelService {
    selfData: any;
    selfData$: Observable<any>;
    updateSelfData$: Subject<any> = new Subject<any>();
    current_page: number = 1;
    pagination_limit: number = 10;
    combinedProducts$: Observable<any>;
    products$: Observable<any> = Observable.empty();
    public isDataLoaded$: any = new BehaviorSubject(false);
    totalCount$: Subject<any> = new Subject<any>();

    constructor(public injector: Injector,
                public userService: UserService,
                public accountService: AccountService,
                public restangular: Restangular) {
        super(restangular);

        // combine global vendors observable with account vendors from account observable
        this.combinedProducts$ = Observable
            .combineLatest(
                this.collection$,
                this.userService.selfData$
            )
            // filter for emitting only if user account exists (for logout user updateSelfData)
            .filter(([vendors, user]) => {
                return user.account;
            })
            // .map(([vendors, user]) => {
            //   let accountVendors = user.account.vendors;
            //   // find and combine vendors
            //   let commonVendors = _.map(vendors, (globalVendor: any) => {
            //     globalVendor = new VendorModel(globalVendor);
            //     _.each(accountVendors, (accountVendor: AccountVendorModel) => {
            //       if (accountVendor.vendor_id == globalVendor.id){
            //         // globalVendor.account_vendor = accountVendor;
            //         globalVendor.account_vendor.push(accountVendor);
            //         if (!accountVendor.location_id)
            //           globalVendor.priority = accountVendor.priority;
            //       }
            //     });
            //     return globalVendor;
            //   });
            //   return commonVendors;
            // })
            .publishReplay(1).refCount();

        this.onInit();
    }

    onInit() {
        this.selfData$ = Observable.merge(
            this.updateSelfData$
        );
        this.selfData$.subscribe((res) => {
            this.selfData = res;
            console.log(`${this.constructor.name} Update SELF DATA`, res);
        });

        // TODO: if there are account products then set those to collection$
        // this.collection$ = this.restangular.all('products').customGET('')
        //     .map((res: any) => {
        //       return res.data.results;
        //     })
        // .do((res: any) => {
        //   this.updateCollection$.next(res);
        // });
    }


    private getProductsData(query: any = {}, reset: boolean = true) {
        return this.restangular.all('products').customGET('', query)
            .map((res: any) => {
                if (0) {
                    this.updateCollection$.next(res.data.results);
                } else {
                    this.addCollectionToCollection$.next(res.data.results);
                }
                this.totalCount$.next(res.data.count);
                this.isDataLoaded$.next(true);
                // this.updateCollection$.next(res.data.vendors);
                return res.data.results;
            });
    }


    getNextProducts(page?, search_string?, sortBy?) {
        let query: any = {
            page: this.current_page,
            limit: this.pagination_limit,
        };
        if (search_string) {
            query.query = search_string;
        }
        if (sortBy && sortBy == 'Z-A') {
            query.sort = 'desc';
        }

        return this.getProductsData(query, page ? false : true);
    }


    addSubscribers() {
        this.entity$.subscribe((res) => {
            this.updateSelfData(res);
        });
    }

    updateSelfData(data) {
        this.updateSelfData$.next(data);
    }

    getProducts() {
        return this.products$.isEmpty().switchMap((isEmpty) => {
            if (isEmpty) {
                this.products$ = this.restangular.all('products').customGET('')
                    .map((res: any) => {
                        return res.data.results;
                    });
            }
            return this.products$;
        });

        // TODO: if there are account products then set those to collection$
        // this.collection$ = this.restangular.all('products').customGET('')
        //     .map((res: any) => {
        //       return res.data.results;
        //     });
        // return this.collection$;
    }

    getProductsLocation(id) {
        return this.products$ = this.restangular.all('products').customGET('', {location_id: id})
            .map((res: any) => {
                return res.data.results;
            }).do(res => {
                this.updateCollection$.next(res);
            });
    }

    getProduct(id) {
        return this.restangular.one('products', id).get();
    }

    getProductLocation(id, location_id) {
        return this.restangular.one('products', id).get({location_id: location_id});
    }

    searchProduct(query) {
        return this.restangular.all('search').getList('products', {query: query});
    }

    getProductComments(id) {
        return this.restangular.one('products', id).all('comments').customGET()
    }

    addProductComment(comment) {
        return this.restangular.all('comments').post(comment)
    }

    deleteProductComment(id) {
        return this.restangular.one('comments', id).remove()
    }

    editProductComment(comment) {
        let commentRestangularized = this.restangular.restangularizeElement(null, comment, "comments");
        return commentRestangularized.put()
    }

    // getAccountVendors(){
    //   let vendorsLoaded = this.userService.selfData.account.vendors ? this.userService.selfData.account.vendors.length > -1 : false;
    //   if (!vendorsLoaded) {
    //     return this.restangular.one('accounts', this.userService.selfData.account_id).customGET('vendors')
    //         .map((res: any) => {
    //           return res.data.vendors;
    //         })
    //         .do((res: any) => {
    //           let account = this.userService.selfData.account;
    //           account.vendors = res;
    //           this.accountService.updateSelfData(account);
    //         });
    //   } else {
    //     return this.userService.selfData$.map(res => res.account.vendors);
    //   }
    // }
    //
    // addAccountVendor(data){
    //   let account = this.userService.selfData.account;
    //   let entity$ = this.restangular
    //       .one('accounts', account.id)
    //       .all('vendors')
    //       // .allUrl('post', 'http://api.pacific-grid.2muchcoffee.com/v1/deployments/test-post')
    //       .post(data);
    //
    //   // TODO: remove after testing
    //   // let entity$ = this.httpService.post('http://uptracker-api.herokuapp.com/api/v1/accounts/' + data.get('account_id') + '/vendors', data);
    //
    //
    //   return entity$
    //       .map((res: any) => {
    //         return res.data.vendor;
    //       })
    //       .do((res: any) => {
    //         account.vendors.push(res);
    //         this.accountService.updateSelfData(account);
    //       });
    // }
    //
    // editAccountVendor(vendorInfo: any, data){
    //   let account = this.userService.selfData.account;
    //   // if no id then add new vendor
    //   if (!vendorInfo.id) {
    //     return this.addAccountVendor(data);
    //   } else {
    //     let entity$ = this.restangular
    //         .one('accounts', vendorInfo.account_id)
    //         .one('vendors', vendorInfo.id)
    //         .customPUT(data, undefined, undefined, {'Content-Type': undefined});
    //
    //     return entity$
    //         .map((res: any) => {
    //           return res.data.vendor;
    //         })
    //         .do((res: any) => {
    //           let vendorArr = _.map(account.vendors, function(vendor){
    //             return vendor['id'] == res.id ? res : vendor;
    //           });
    //           account.vendors = vendorArr;
    //           this.accountService.updateSelfData(account);
    //         });
    //   }
    // }
}