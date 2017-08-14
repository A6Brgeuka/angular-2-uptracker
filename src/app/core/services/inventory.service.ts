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
  public selectedStep3Tab:any = null;
  
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
      inventory_id: inventory.id || inventory.inventory_id,
      favorite: !inventory.favorite
    }
    return this.restangular.one('inventory', 'favorite').customPOST(postData).map((res: any) => res.data);
  }
  
  getInventoryItem(id: string) {
    //GET /api/v1/invntory/{inventory_id}
    return this.restangular.one('inventory', id || 1).customGET().map((res: any) => res.data);
  }
  
  addItemsToInventory(data: any, newInventory, locations, newInventoryPackage) {
    let payload = {
      products: data.map(({product_id,variant_id}: any) => ({
        product_id,
        variant_id,
        vendor_name:null,
        vendor_id:null
      })),
      name: newInventory.name,
      department: newInventory.department,
      category: newInventory.category,
      account_category: newInventory.account_category,
      tax_exempt: newInventory.tax_exempt,
      trackakble: newInventory.trackable,
      description: newInventory.description,
      notes: newInventory.notes,
      msds: newInventory.msds,
      attachments: newInventory.attachments,
      image: newInventory.image,
      inventory_by: newInventory.inventory_by,
      locations: locations.map((location) => {
        return {
          name: location.name,
          location_id: location.id,
          critical_level: location.critical_level,
          fully_stocked: location.fully_stocked,
          overstock_level: location.overstock_level,
          tracking_method: location.tracking_method,
          auto_reorder_start_date: location.auto_reorder_start_date,
          auto_reorder_frequency: location.auto_reorder_frequency,
          auto_reorder_timespan: location.auto_reorder_timespan,
          auto_reorder_qty: location.auto_reorder_qty,
          storage_locations: location.inventory_locations.map((storage) => {
            return {
              name: storage.name,
              inventory_location_id: storage.id,
              on_hand: storage.on_hand
            }
          })
        }
      }),
      package_type: newInventoryPackage.package_type,
      sub_package_type: newInventoryPackage.sub_package_type,
      sub_package_qty: newInventoryPackage.sub_package_qty,
      consumable_unit_type: newInventoryPackage.consumable_unit_type,
      consumable_unit_qty: newInventoryPackage.consumable_unit_qty
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
  autocompleteSearch(keywords: string) {
    return this.restangular.one('inventory', 'suggest').customGET('', {'q': keywords}).map((res: any) => res.data);
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
          variant_id:item.variant_id
        }
      })
    }
    return this.restangular.one('inventory', 'check').customPOST(payload).map((res: any) => res.data);
  }
  
  getPackagesLists() {
   return this.restangular.one('config', 'product_units').customGET('')
      .map(res => {
       this.outerPackageList = res.data.outer_package;
       this.innerPackageList = res.data.inner_package;
       this.consumablePackageList = res.data.consumable_unit;
      })
  }
  
  deleteInventory(inventory) {
    return this.restangular.one('inventory', inventory.id).remove();
  }

  uploadAttachment(document: File): Observable<any> {
    if (!document) {
      return Observable.of({'continue': 'no docs to upload'});
    }
    let formData: FormData = new FormData();
    formData.append('attachment', document);
    return this.restangular
    .one('inventory', 'attachment')
    .customPOST(formData)
    .map((res: any) => res.data);
  }
}
