import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Restangular } from 'ngx-restangular';
import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { BehaviorSubject } from 'rxjs';
import { InventorySearchResults } from '../../models/inventory.model';
import { ToasterService } from './toaster.service';

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class InventoryService extends ModelService {
  
  public isGrid: boolean = false;
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  current_page: number = 1;
  pagination_limit: number = 10;
  combinedInventory$: Observable<any>;
  public isDataLoaded$: any = new BehaviorSubject(false);
  totalCount$: any = new BehaviorSubject(1);
  location$: any = new BehaviorSubject(false);
  getInventoryData$: any = new Subject();
  location: string;
  total: number = 1;
  outerPackageList = [];
  innerPackageList = [];
  consumablePackageList = [];
  outerPackageList$: Observable<any>;
  
  constructor(
    public injector: Injector,
    public userService: UserService,
    public accountService: AccountService,
    public restangular: Restangular,
    public toasterService: ToasterService
  ) {
    super(restangular);
    
    this.combinedInventory$ = Observable
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
    this.getInventoryData$
    .withLatestFrom(this.location$)
    .map(([queryParams, location]) => {
      if (location) {
        queryParams.query.location_id = location.id;
      }
      return queryParams;
    })
    .switchMap((queryParams) => {
      return this.restangular.all('inventory').customGET('', queryParams.query)
    })
    .subscribe((res) => {
        res.data.map((item: any) => Object.assign(item, {status: 1}));
        this.loadCollection$.next(res.data);
        this.totalCount$.next(res.data.length); // change to .count when the api is ready
        this.isDataLoaded$.next(true);
        return res.data;
      }
    );
    this.selfData$ = Observable.merge(
      this.updateSelfData$
    );
    this.selfData$.subscribe((res) => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);
    });
    
  }
  
  getNextInventory(page?, search_string?, sortBy?) {
    if (page == 0) {
      this.loadCollection$.next([]);
      this.current_page = 1;
    }
    let query: any = {
      page: this.current_page,
      limit: this.pagination_limit,
    };
    if (search_string) {
      query.query = search_string;
    } else {
    }
    if (sortBy && sortBy == 'Z-A') {
      query.sort = 'desc';
    }
    
    return this.getInventoryData(query, page ? false : true);
  }
  
  public getInventoryData(query: any = {}, reset: boolean = true) {
    this.getInventoryData$.next({query, reset});
    return this.getInventoryData$.delay(500);
  }
  
  addSubscribers() {
    this.entity$.subscribe((res) => {
      this.updateSelfData(res);
    });
  }
  
  updateSelfData(data) {
    this.updateSelfData$.next(data);
  }
  
  updateInventoryItem(data: any) {
    this.updateElementCollection$.next(data);
  }
  
  setFavorite(inventory) {
    let postData = {
      inventory_id: inventory.id,
      favorite: !inventory.favorite
    }
    return this.restangular.one('inventory', 'favorite').customPOST(postData);
  }
  
  getInventoryItem(id: string) {
    //GET /api/v1/invntory/{inventory_id}
    return this.restangular.one('inventory', id || 1).customGET().map((res: any) => res.data);
  }
  
  addItemsToInventory(data: any) {
    let payload = {
      products: data.map((item) => {
        return {
          product_id: item.product_id,
          variant_id: item.variant_id,
          vendor_variant_id: item.vendor_variant_id
        }
      }),
      package_type: data[0].package_type,
      sub_package_type: data[0].sub_package.properties.unit_type,
      sub_package_qty: data[0].sub_package.properties.qty,
      consumable_unit_type: data[0].consumable_unit.properties.unit_type,
      consumable_unit_qty: data[0].consumable_unit.properties.qty
    };
    return this.restangular.all('inventory').customPOST(payload)
    .map((newInventory: any) =>
      {
        this.totalCount$.next(this.totalCount$['_value']+1);
        this.addCollectionToCollection$.next(newInventory.data);
      }
    );
  }
  
  search(keyword: string) {
    //GET /api/v1/inventory/search?q={keyword,upc,catalog number}
    return this.restangular.one('inventory', 'search').customGET('', {'q': keyword}).map((res: any) => res.data);
  }
  
  addInventoryItemComment(c: any) {
  }
  
  editInventoryItemComment(c: any) {
  }
  
  checkIfNotExist(items:InventorySearchResults[]){
    let payload = {
      products: items.map(item => {
        return {
          product_id: item.product_id,
          vendor_variant_id:item.vendor_variant_id
        }
      })
    }
    // GET /api/v1/inventory/check?product_id={product_id}&vendor_variant_id={vendor_variant_id}
    return this.restangular.one('inventory', 'check').customPOST(payload).map((res: any) => res.data);
  }
  
  getOuterPackageList() {
   return this.restangular.one('config', 'product_units').customGET('')
      .map(res => {
        //res.data.outer_package
       this.outerPackageList = res.data.outer_package;
       this.innerPackageList = res.data.inner_package;
       this.consumablePackageList = res.data.consumable_unit;
      })
    //.publishReplay(1).refCount()
    .subscribe()
      ;
  }
}
