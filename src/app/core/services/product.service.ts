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
    location$: any = new BehaviorSubject(false);
    getProductsData$: any = new Subject();
    location:string;
    total:number;

    constructor(public injector: Injector,
                public userService: UserService,
                public accountService: AccountService,
                public restangular: Restangular) {
        super(restangular);

        this.combinedProducts$ = Observable
            .combineLatest(
                this.collection$,
                this.userService.selfData$
            )
            .filter(([vendors, user]) => {
                return user.account;
            })
            .publishReplay(1).refCount();

        this.onInit();
    }

    onInit() {
        this.getProductsData$
            .map(([queryParams, location])=>{
            debugger;
             queryParams.query.location_id = location.id;
             return queryParams;
            })
            .switchMap((queryParams) => {
              return this.restangular.all('products').customGET('', queryParams.query)
            })
            .subscribe((res) => {
                this.addCollectionToCollection$.next(res.data.results);
                this.totalCount$.next(res.data.count);
                this.isDataLoaded$.next(true);
                return res.data.results;
            }
        );

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
    

    getNextProducts(page?, search_string?, sortBy?) {
        if (page==0) {
            this.loadCollection$.next([]);
            this.current_page = 1;
        }
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
//
        return this.getProductsData(query, page ? false : true);
    }
    
    private getProductsData(query: any = {}, reset: boolean = true) {
        
            this.getProductsData$.next({query,reset});
            return this.getProductsData$;
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
        return this.products$ = this.restangular.all('products').customGET('', {location_id: id, limit:this.pagination_limit})
            .map((res: any) => {
                this.totalCount$.next(res.data.count);
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

    updateProduct(data) {
        return this.restangular.one('accounts', this.userService.selfData.account_id).all('products').post(data);
    }

    deepDiff(obj1: any, obj2: any):any {
        if (_.isFunction(obj1) || _.isFunction(obj2)) {
            throw 'Invalid argument. Function given, object expected.';
        }
        if (this.isValue(obj1) || this.isValue(obj2)) {
            if (obj1!=obj2) {
                return obj1;
            } else {
                return 'unmdf';
            }
        }
        let diff = {};
        for (let key in obj1) {
            if (_.isFunction(obj1[key])) {
                continue;
            }
            let value2 = undefined;
            if ('undefined' != typeof(obj2[key])) {
                value2 = obj2[key];
            }
            let val =  this.deepDiff(obj1[key], value2);
            if (val!="unmdf" && (!_.isEmpty(val) || this.isValue(val))) {diff[key] = val;}
        }
        return diff;
    };
    isValue(obj) {
        return !_.isObject(obj) && !_.isArray(obj);
    }
    
    emptyValues(obj: any): any {
        if (obj === false || this.isValue(obj)) {return true;}
        if (_.isEmpty(obj)) {return false;}
        for (let i in obj) {
            if (this.emptyValues(obj[i])) {return true};
        }
        return false;
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