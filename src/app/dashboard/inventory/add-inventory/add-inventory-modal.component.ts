import {
  Component, OnInit, ViewChild, ElementRef, OnDestroy, NgZone, ViewChildren, QueryList,
  Input
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService, AccountService } from '../../../core/services/index';
import { InventoryService } from '../../../core/services/inventory.service';
import { AttachmentFiles, InventorySearchResults, searchData, Vendor } from '../../../models/inventory.model';

import * as _ from 'lodash';
import { ToasterService } from '../../../core/services/toaster.service';

import { FileUploadService } from '../../../core/services/file-upload.service';
import { InventoryLocationModel, InventoryModel, InventoryProductModel, InventoryStorageLocationModel } from '../../../models/create-inventory.model';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { HelpTextModal } from './help-text-modal/help-text-modal-component';

export class AddInventoryModalContext extends BSModalContext {
  inventoryItems: any[] = [];
  inventoryGroup: any = null;
  selectedProduct: any = null;
}

@Component({
  selector: 'app-add-inventory-modal',
  templateUrl: './add-inventory-modal.component.html',
  styleUrls: ['./add-inventory-modal.component.scss']
})

@DestroySubscribers()
export class AddInventoryModal implements OnInit, OnDestroy, CloseGuard, ModalComponent<AddInventoryModalContext> {
  public subscribers: any = {};
  context: AddInventoryModalContext;
  total: number = 0;
  public typeIn$: any = new Subject();
  searchResults$: any = new BehaviorSubject([]);
  searchResults: any[] = [];
  public noSearchedRes: string = null;
  checkBoxCandidates:boolean=false;
  checkBoxItems:boolean=false;
  public newProductData: any = new InventorySearchResults();
  public items$: Observable<any>;
  public items;
  public loadItems$: Subject<any> = new Subject<any>();
  public addItemsToItems$: Subject<any> = new Subject<any>();
  public deleteFromItems$: Subject<any> = new Subject<any>();
  public addCustomItemToItems$: Subject<any> = new Subject<any>();
  public editAddItemToItems$: Subject<any> = new Subject<any>();
  public updateItems$: Subject<any> = new Subject<any>();
  public addCustomProduct: boolean = false;
  public editCustomProduct: boolean = false;
  public saveAdded$: any = new Subject<any>();
  public updateAdded$: any = new Subject<any>();
  public newInventory: any = new InventoryModel;
  public classDirty: boolean = false;
  public packageType$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public resultItems$: Observable<any>;
  public checkedProduct$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public checkedProduct: any[] = [];
  public matchingProductDisabled: boolean = false;
  public matchingAll$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  public showSelect: boolean = true;
  public searchText: string = '';
  public autocompleteProducts: any =  [];
  public autocompleteProducts$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteVendors$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteVendors: any = [];
  public autocompleteOuterPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteOuterPackage: any = [];
  public autocompleteInnerPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteInnerPackage: any = [];
  public autocompleteConsPackage$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteConsPackage: any = [];
  public vendorDirty: boolean = false;
  public vendorValid: boolean = false;
  public packDirty: boolean = false;
  
  public file$:Observable<any>;
  public file;
  public loadFile$: Subject<any> = new Subject<any>();
  public addFileToFile$: Subject<any> = new Subject<any>();
  public deleteFromFile$: Subject<any> = new Subject<any>();
  public updateFile$: Subject<any> = new Subject<any>();
  public msds$:Observable<any>;
  public loadMsds$: Subject<any> = new Subject<any>();
  public addMsdsToMsds$: Subject<any> = new Subject<any>();
  public deleteFromMsds$: Subject<any> = new Subject<any>();
  public productImg$: ReplaySubject<any> = new ReplaySubject(1);
  public msds: any;
  public uploadedImage;
  public fileIsOver: boolean = false;
  public categoryValid: boolean = true;
  
  public departmentCollection: any;
  public productAccountingCollection:  any;
  public productCategoriesCollection: any;
  
  @ViewChild('step1') step1: ElementRef;
  @ViewChild('step2') step2: ElementRef;
  @ViewChild('step3') step3: ElementRef;
  @ViewChild('step4') step4: ElementRef;
  
  @ViewChildren('locationTab') locationTabsList: QueryList<any>;
  
  public locations$: Observable<any> = this.accountService.locations$;
  public locations: any[];
  public showAddCustomBtn: boolean;
  public outerPack: string = '';
  public innerPack: string = '';
  
  constructor(
    public zone: NgZone,
    public dialog: DialogRef<AddInventoryModalContext>,
    public userService: UserService,
    public accountService: AccountService,
    public inventoryService: InventoryService,
    public toasterService: ToasterService,
    public fileUploadService: FileUploadService,
    public modalWindowService: ModalWindowService,
    public modal: Modal,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
    this.typeIn$
    .debounceTime(500)
    .switchMap((key: string) => {
      this.showAddCustomBtn = (key !== null);
      return this.inventoryService.search(key)})
    .subscribe((data: searchData) => {
      if (data.results) {
        this.total = data.count;
        this.searchResults$.next(data.results);
        this.searchResults = data.results;
        if (this.items.length) {
          this.checkedProduct = [];
          this.autocompleteConsPackage = [this.items[0].consumable_unit.properties.unit_type];
          this.checkConsPackage(this.items[0].consumable_unit.properties.unit_type);
        }
        if (!this.items.length && this.checkedProduct.length) {
          this.checkedProduct = [];
          this.packageType$.next({});
          this.checkConsPackage(null);
        }
        this.checkedProduct$.next({});
      }
    
    });
  
    this.saveAdded$
    .switchMap(() => {
      return this.items$
      .switchMap(items => {
        this.newInventory.products.map((product) => {
          if (product.product_id === null) {
            product.variant_id = null;
          }
        });
        return this.inventoryService.addItemsToInventory(this.newInventory)});
    })
    .subscribe(newInventory => this.closeModal(newInventory));
  
    this.updateAdded$
    .switchMap(() => {
      return this.inventoryService.updateInventory(this.newInventory)
    })
    .subscribe(newInventory => this.closeModal(newInventory));
  
    this.fileActions();
    this.msdsActions();
    
    this.loadFile$.next([]);
    this.loadMsds$.next([]);
    
    let addItemsToItems$ = this.addItemsToItems$
    .switchMap((itemsToCheck: any[]) =>
      this.inventoryService.checkIfNotExist(itemsToCheck)
      .let(this.checkExistedProduct(itemsToCheck)))
    .switchMap((newItems: any[]) =>
      this.items$.first()
      .map((items: any) => {
        const newNotChosenItems: any[] = newItems.reduce((acc: any[], item) => {
          const {variant_id, product_id} = item;
          let currentItem = _.find(items, {variant_id, product_id});
          if (currentItem) {
            this.toasterService.pop('error', item.name +  `${item.name} is already added`);
          }
          if(!currentItem) {
            item.checked = false;
          }
          return !currentItem ? [...acc, item] : [...acc]
        }, []);
        
        return [...items, ...newNotChosenItems];
      })
    
    );
    
    let deleteFromItems$ = this.deleteFromItems$
    .switchMap((deleteItems) =>
      this.items$.first()
      .map((items: any) => items.filter((el: any) => el.variant_id !== deleteItems.variant_id)
      )
    );
    
    let addCustomItemToItems$ = this.addCustomItemToItems$.switchMap((customItem) =>
      this.items$.first().map((items:any) => {
        items =_.concat(items, [customItem[0]]);
        return items;
      })
    );
    
    let updateItems$ = this.updateItems$.switchMap((editedCustomItem) =>
      this.items$.first().map((items:any) => {
        return items.map((el: any) => {
          if (el.variant_id == editedCustomItem.variant_id) {
            el = editedCustomItem;
          }
          return el;
        });
      }));
    
    this.items$ = Observable.merge(
      this.loadItems$,
      this.editAddItemToItems$,
      addItemsToItems$,
      addCustomItemToItems$,
      deleteFromItems$,
      updateItems$
    ).publishReplay(1).refCount();
    
    this.subscribers.itemsSubscription = this.items$.subscribe(res => {
      this.newInventory.products = res.map((el: any) => new InventoryProductModel(el));
      this.showSelect = false;
      if (res.length && !this.context.inventoryGroup) {
        let searchedCategory = (res[0].category) ? this.productCategoriesCollection.indexOf(res[0].category) : null;
        this.newInventory.name = res[0].name;
        this.newInventory.inventory_by_array = res[0].inventory_by;
        this.newInventory.department = (res[0].department) ? res[0].department : this.newInventory.department;
        this.newInventory.category = (searchedCategory !== -1) ? res[0].category : null;
        this.newInventory.description = (res[0].description) ? res[0].description : this.newInventory.description;
        this.autocompleteConsPackage = [res[0].consumable_unit.properties.unit_type];
        this.checkConsPackage(res[0].consumable_unit.properties.unit_type);
      }
      if (res.length && this.context.inventoryGroup) {
        this.newInventory.inventory_by_array = res[0].inventory_by;
        this.autocompleteConsPackage = [res[0].consumable_unit.properties.unit_type];
        this.checkConsPackage(res[0].consumable_unit.properties.unit_type);
      }
      if (!res.length) {
        this.newInventory.consumable_unit_qty = null;
      }
      if (!res.length && !this.checkedProduct.length) {
        this.autocompleteConsPackage = this.inventoryService.consumablePackageList;
        this.checkConsPackage(null);
      }
      setTimeout(()=>{ this.showSelect = true;
      },0.6);
      this.items = res;
    });
    //load initial items from context
    this.loadItems$.next(this.context.inventoryItems);
    if (this.context.inventoryGroup) {
      let editedItems = this.context.inventoryGroup.inventoryGroup.inventory_products.map(product => {
        if (!product.variant_id) {
          product.variant_id = 'tmp' + Math.floor(Math.random() * 10000000);
        }
        return new InventorySearchResults(product);
      });
      this.editAddItemToItems$.next(editedItems);
      this.newInventory = new InventoryModel(
        Object.assign(this.context.inventoryGroup.inventoryGroup, {
          products: this.context.inventoryGroup.inventoryGroup.inventory_products,
          inventory_by: this.context.inventoryGroup.inventoryGroup.inventory_by,
          locations: this.context.inventoryGroup.inventoryGroup.inventory_item_locations,
          inventory_by_array: this.newInventory.inventory_by_array,
          id: this.context.inventoryGroup.inventoryGroup.id,
        })
      );
      this.locations = this.newInventory.locations;
      this.locations[0].active = true;
      this.loadMsds$.next(this.newInventory.msds);
      this.loadFile$.next(this.newInventory.attachments);
      this.newInventory.id = this.context.inventoryGroup.inventoryGroup.id;
      this.newInventory.inventory_selected = _.find(this.newInventory.inventory_by_array, ['value', this.newInventory.inventory_by]);
      this.newInventory.inventory_by_qty = this.newInventory.inventory_selected.qty;
      this.newInventory.products.map(item => {
        item.selectedVendor = {vendor_name: item.vendor_name, vendor_id: item.vendor_id};
        this.compareVendor(item.selectedVendor, item.selectedVendor);
      });
    }
  
    if (this.context.selectedProduct) {
      let editedItems: any[] = [new InventorySearchResults(this.context.selectedProduct)];
      this.editAddItemToItems$.next(editedItems);
    }
    
    this.resultItems$ = Observable.combineLatest(this.packageType$, this.searchResults$, this.checkedProduct$, this.matchingAll$)
    .map(([packageType,searchResults,checkedProduct,matchingAll]: any) => {
      let filteredResults = _.filter(searchResults, packageType);
      
      let checkedResults = searchResults.reduce((acc: any[], item) => {
        let foundedItem = _.find(
          filteredResults,
          { variant_id: item.variant_id, product_id: item.product_id}
        );
        
        return [...acc,{
          ...item,
          notActive: !foundedItem
        }]
      },[]);
      
      let checkboxResult = checkedResults.reduce((acc: any[], item) => {
          if (!matchingAll) {
            const {variant_id, product_id} = item;
            let foundedItem = _.find(
              checkedProduct,
              {variant_id, product_id}
            );
            return [
              ...acc,
              {
                ...item,
                checked: !!foundedItem
              }
            ];
          } else {
            const {notActive} = item;
            let foundedItem = _.find(
              checkedProduct,
              {notActive}
            );
            
            return [
              ...acc,
              {
                ...item,
                checked: !!foundedItem
              }
            ];
          }
        },
        []);
      this.checkedProduct = _.filter(checkboxResult, 'checked');
      return checkboxResult;
    });
    
    this.productImg$
    .switchMap((img: any) => this.inventoryService.uploadAttachment(img))
    .subscribe((image: any) => {
      this.newInventory.image = image.public_url
    });
    
    if (!this.context.inventoryGroup) {
      this.locations$.subscribe(location => {
        this.locations = location;
        this.locations[0].active = true;
        this.newInventory.locations = location.map(el => {
          el.location_id = el.id;
          el.storage_locations = el.inventory_locations.map(storage => {
            storage.inventory_location_id = storage.id;
            return new InventoryStorageLocationModel(storage)
          });
          return new InventoryLocationModel(el);
        });
      })
    }
    
    this.autocompleteOuterPackage$.next('');
    this.autocompleteInnerPackage$.next('');
  }
  
  ngOnDestroy() {
    this.saveAdded$.unsubscribe();
    this.productImg$.unsubscribe();
    this.updateAdded$.unsubscribe();
  }
  
  addSubscribers() {
    this.subscribers.getProductCategoriesSubscription = this.accountService.getProductCategories().take(1)
    .subscribe(res => this.productCategoriesCollection = res);
    
    this.subscribers.autocompleteProductsSubscription = this.autocompleteProducts$
    .switchMap((keywords: string) => this.inventoryService.autocompleteSearch(keywords)).publishReplay(1).refCount()
    .subscribe(res => {
      this.autocompleteProducts = res['suggestions'];
    });
    
    this.subscribers.autocompleteVendorsSubscription = this.autocompleteVendors$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchVendor(key)).publishReplay(1).refCount()
    .subscribe((vendors:any) => this.autocompleteVendors = vendors);
    
    this.subscribers.autocompleteOuterPackSubscription = this.autocompleteOuterPackage$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
    .subscribe((pack:any) => this.autocompleteOuterPackage = _.sortBy(pack, ['unit_name']));
    
    this.subscribers.autocompleteInnerPackSubscription = this.autocompleteInnerPackage$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
    .subscribe((pack:any) => this.autocompleteInnerPackage = _.sortBy(pack, ['plural_unit_name']));
    
    this.subscribers.autocompleteConsPackSubscription = this.autocompleteConsPackage$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchPackage(key)).publishReplay(1).refCount()
    .subscribe((pack:any) => this.autocompleteConsPackage = pack);
    
    this.subscribers.departmentCollectionSubscription = this.accountService.getDepartments().take(1)
    .subscribe(departments => this.departmentCollection = departments);
    
    this.subscribers.productAccountingCollectionSubscription = this.accountService.getProductAccounting().take(1)
    .subscribe(productAccountingCol => this.productAccountingCollection = productAccountingCol);
  }
  
  onSearchTypeIn(event) {
    this.autocompleteProducts$.next(event.target.value);
    if (event.target.value.length > 2) {
      this.typeIn$.next(event.target.value);
    } else {
      this.typeIn$.next(null);
    }
  }
  
  selectedAutocompled(keyword) {
    if (keyword && keyword.length > 2) {
      this.typeIn$.next(keyword);
    } else {
      this.typeIn$.next(null);
    }
  }
  observableSource(keyword: any) {
    return Observable.of(this.autocompleteProducts).take(1);
  }
  
  selectedAutocompledVendor(vendor) {
    this.newProductData.vendors = [vendor];
  }
  onSearchVendor(event) {
    this.newProductData.vendors = [{vendor_name: event.target.value, vendor_id: null}];
    this.vendorDirty = true;
    this.vendorValid = !!(event.target.value);
    this.autocompleteVendors$.next(event.target.value);
  }
  observableSourceVendor(keyword: any) {
    return Observable.of(this.autocompleteVendors).take(1);
  }
  
  selectedAutocompledOuterPackage(outerPackage) {
    this.newProductData.package_type = outerPackage.unit_name;
  }
  onSearchOuterPackage(event) {
    this.autocompleteOuterPackage$.next(event.target.value);
  }
  observableSourceOuterPackage(keyword: any) {
    return Observable.of(this.autocompleteOuterPackage).take(1);
  }
  
  updateOuterPackege(event) {
    this.outerPack = (this.newProductData.package_type === event.target.value) ? this.newProductData.package_type : null;
    if (!this.outerPack) {
      this.autocompleteOuterPackage$.next('');
    }
  }
  
  selectedAutocompledInnerPackage(innerPackage) {
    this.newProductData.sub_package.properties.unit_type = innerPackage.plural_unit_name;
  }
  onSearchInnerPackage(event) {
    this.autocompleteInnerPackage$.next(event.target.value);
  }
  observableSourceInnerPackage(keyword: any) {
    return Observable.of(this.autocompleteInnerPackage).take(1);
  }
  updateInnerPackege(event) {
    this.innerPack = (this.newProductData.sub_package.properties.unit_type === event.target.value) ? this.newProductData.sub_package.properties.unit_type : null;
    if (!this.innerPack) {
      this.autocompleteInnerPackage$.next('');
    }
  }
  selectedAutocompledConsPackage(consPackage) {
    this.newProductData.consumable_unit.properties.unit_type = consPackage.unit_name ? consPackage.unit_name : consPackage;
  }
  onSearchConsPackage(event) {
    this.packDirty = true;
    this.newProductData.consumable_unit.properties.unit_type = event.target.value;
    this.autocompleteConsPackage$.next(event.target.value);
  }
  observableSourceConsPackage(keyword: any) {
    return Observable.of(this.autocompleteConsPackage).take(1);
  }

  compareVendor(v1, v2) {
      return v1 && v2 ? v1.vendor_id === v2.vendor_id : v1 === v2;
  }

  checkExistedProduct(itemsToCheck) {
    return (source) =>
      source.map(resItems => {
        const existedItems: any[] = _.filter(resItems, 'exists');
        const notExistedItems: any[] = _.reject(resItems, 'exists');
        const newNotExistedItems: any[] = notExistedItems.reduce((acc: any[], {product_id,variant_id}) => {
          let item = _.find(itemsToCheck,{variant_id,product_id});
          return item ? [...acc,item] : acc
        },[]);

        const newExistedItems: any[] = existedItems.reduce((acc: any[], {product_id,variant_id}) => {
          let item = _.find(itemsToCheck,{variant_id,product_id});
          return item ? [...acc,item] : acc
        },[]);

        if(newExistedItems.length) {
          newExistedItems.forEach((item: any) => {
            this.toasterService.pop('error',  `${item.name} exists`);
          })
        }
        return newNotExistedItems;
      })
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data) {
    this.dialog.close(data);
  }
  
  addToInventory(items: InventorySearchResults[]) {
    this.addItemsToItems$.next(items);
  }
  
  addCustomToInventory(items: InventorySearchResults[]) {
    this.addCustomItemToItems$.next(items);
  }
  
  deleteFromInventory(items: InventorySearchResults[]) {
    items.map((i) => this.deleteFromItems$.next(i));
    this.checkBoxItems = false;
  }
  
  putCheckbox(item) {
    
    this.showSelect = false;
    item.checked = !item.checked;
    
    if(!this.checkedProduct.length && !this.items.length) {
      let packageType = {
        consumable_unit: {properties: {unit_type: item.consumable_unit.properties.unit_type}}
      };
      this.autocompleteConsPackage = [item.consumable_unit.properties.unit_type];
      this.checkConsPackage(item.consumable_unit.properties.unit_type);
      this.packageType$.next(packageType);
    }
    
    let result = _.find(this.checkedProduct,  { variant_id: item.variant_id, product_id: item.product_id});
    
    if(!result && item.checked) {
      this.checkedProduct.push(item);
    }
    if (result && !item.checked) {
      _.remove(this.checkedProduct, result)
    }
    
    this.checkedProduct$.next(this.checkedProduct);
    this.matchingAll$.next(false);
    
    this.matchingProductDisabled = !!this.checkedProduct.length;
    
    if (!item.checked) {
      this.checkBoxCandidates = false;
    }
    
    if(!this.checkedProduct.length && !this.items.length) {
      this.autocompleteConsPackage = this.inventoryService.consumablePackageList;
      this.checkConsPackage(null);
      this.packageType$.next({});
    }
    setTimeout(() => { this.showSelect = true },0.6);
  }
  
  selectAllCandidates() {
    this.matchingProductDisabled = !!this.checkBoxCandidates;
    this.matchingAll$.next(this.checkBoxCandidates);
    if (!this.checkBoxCandidates) {
      this.checkedProduct = [];
      this.checkedProduct$.next(this.checkedProduct);
    }
    if (!this.checkBoxCandidates && !this.items.length) {
      this.packageType$.next({});
    }
  }
  
  selectAllItems() {
    this.loadItems$.next(
      this.items.map((item: InventorySearchResults) => {
        item.checked = this.checkBoxItems;
        return item;
      })
    );
  }
  
  bulkAdd() {
    this.resultItems$
    .take(1)
    .subscribe((items: InventorySearchResults[]) => {
      const checkedItems = items.filter((item: InventorySearchResults) => item.checked);
      this.addToInventory(checkedItems);
    });
  }
  
  bulkDelete() {
    const checkedItems = this.items.filter((item: InventorySearchResults) => item.checked);
    this.deleteFromInventory(checkedItems);
  }
  
  toggleCustomAdd() {
    this.addCustomProduct = !this.addCustomProduct;
    let test = this.newProductData.consumable_unit.properties.unit_type;
    this.newProductData = new InventorySearchResults();
   
    this.newProductData.custom_product = true;
    this.newProductData.consumable_unit.properties.unit_type = test;
    this.innerPack = '';
    this.outerPack = '';
    this.vendorDirty = false;
  }
  
  toggleCustomCancel() {
    this.addCustomProduct = !this.addCustomProduct;
    this.editCustomProduct = false;
    this.showAddCustomBtn = !this.showAddCustomBtn;
    if (!this.items.length) {
      this.nextPackage({});
    }
  }
  
  addNewProduct() {
    
    if (!this.editCustomProduct) {
      let vendor = (this.newProductData.vendors.length) ? this.newProductData.vendors : [{vendor_name: this.newProductData.vendor_name, vendor_id:null}];
      let inventory_by_arr = [
        {
          type: "Package",
          label: this.newProductData.package_type,
          value: "package",
          qty: ''
        },
        {
          type: "Sub Package",
          label: this.newProductData.sub_package.properties.unit_type,
          value: "sub_package",
          qty: this.newProductData.sub_package.properties.qty,
        },
        {
          type: "Consumable Unit",
          label: this.newProductData.consumable_unit.properties.unit_type,
          value: "consumable_unit",
          qty: this.newProductData.consumable_unit.properties.qty,
        }
      ];
      this.addCustomToInventory([
        new InventorySearchResults(
          Object.assign(this.newProductData, {
            variant_id: 'tmp' + Math.floor(Math.random() * 1000000),
            vendors: vendor,
            inventory_by: inventory_by_arr,
            custom_product: true,
          })
        )
      ]);
      this.vendorValid = false;
    } else {
      this.updateItems$.next(this.newProductData);
    }
    this.toggleCustomAdd();
  }
  
  changePrice(val) {
    const regex = /[\d\.]*/g;
    let m: any = regex.exec(val);
    regex.lastIndex++;
    let m1: any = regex.exec(val);
    if (m && m[0]) {
      val = parseFloat(m[0] ? m[0] : '0');
    } else if (m1 && m1[0]) {
      val = parseFloat(m1[0] ? m1[0] : '0');
    }
    if (!val) {
      val = 0;
    }
    return val;
  }
  
  onChangeListPrice(val) {
    let value = this.changePrice(val);
    this.newProductData.list_price = value;
    this.newProductData.formattedPrice = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  onChangeForumPrice(val) {
    let value = this.changePrice(val);
    this.newProductData.price = value;
    this.newProductData.formattedForumPrice = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  onChangeClubPrice(val) {
    let value = this.changePrice(val);
    this.newProductData.club_price = value;
    this.newProductData.formattedClubPrice = value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  selectPackageType(packageType) {
    this.newInventory.inventory_by = packageType.value;
    this.newInventory.inventory_by_qty = packageType.qty;
    this.newInventory.inventory_by_type = packageType.type;
    this.newInventory.inventory_by_label = packageType.label;
  }
  
  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
    .overlayConfigFactoryWithParams({"text": ''}, true, 'mid'))
  }
  
  saveAdded() {
    if (!this.newInventory.category) {
      this.categoryValid = false;
    } else {
      if (this.context.inventoryGroup) {
        this.updateAdded$.next();
      } else {
        this.saveAdded$.next();
      }
    }
  }
  
  nextPackage(value) {
    let formValue = {};
    
    formValue = value.consumable_unit_type ? {
      ...formValue,
      consumable_unit: {properties: {unit_type: value.consumable_unit_type}}
    }: formValue;
    
    this.packageType$.next(formValue);
  }
  
  checkConsPackage(e) {
    this.newInventory.consumable_unit_type = e;
    this.newProductData.consumable_unit.properties.unit_type = e;
    this.nextPackage(this.newInventory);
    if (e !== null) {this.classDirty = true;}
  }
  
  nextTab() {
    if (this.step1.nativeElement.className == 'active')
      this.step2.nativeElement.click();
    else if (this.step2.nativeElement.className == 'active')
      this.step3.nativeElement.click();
    else if (this.step3.nativeElement.className == 'active'
      && this.newInventory.locations.length > 1
      && !this.newInventory.locations[this.newInventory.locations.length - 1].active) {
        let activeLocationIndex = _.findIndex(this.newInventory.locations, 'active');
        let locationTabsListArr: any[] = this.locationTabsList.toArray();
        locationTabsListArr[activeLocationIndex + 1].nativeElement.click();
    }
    else this.step4.nativeElement.click();
  }
  
  prevTab() {
    if (this.step4.nativeElement.className == 'active')
      this.step3.nativeElement.click();
    else if (this.step3.nativeElement.className == 'active')
      this.step2.nativeElement.click();
    else this.step1.nativeElement.click();
  }
  
  selectTab(location) {
    this.newInventory.locations.forEach((location) => {
      location.active = false;
    });
    location.active = true;
  }

  selectVendor(item, selectedVendor) {
    item.selectedVendor = selectedVendor;
    item.vendor_id = selectedVendor.vendor_id;
    item.vendor_name = selectedVendor.vendor_name;
  }
  // MSDS load, add, delete actions
  msdsActions(): any {
    let addMsdsToMsds$ = this.addMsdsToMsds$
    .switchMap((msds:File)=>this.inventoryService.uploadAttachment(msds[0]))
    .switchMap((res:AttachmentFiles) => {
      return this.msds$.first()
      .map((msds: any) => {
        msds = msds.concat(res);
        return msds;
      });
    });
    
    let deleteFromMsds$ = this.deleteFromMsds$
    .switchMap((deleteMsds) =>
      this.msds$.first()
      .map((msds: any) =>
        msds.filter((el: any) => el.id !== deleteMsds.id)
      )
    );
    
    this.msds$ = Observable.merge(
      this.loadMsds$,
      addMsdsToMsds$,
      deleteFromMsds$
    ).publishReplay(1).refCount();
    this.msds$.subscribe(res => {
      this.newInventory.msds = res;
    });
  }
  // File load, add, delete actions
  fileActions(): any {
    let addFileToFile$ = this.addFileToFile$
    .switchMap((file:File)=>this.inventoryService.uploadAttachment(file[0]))
    .switchMap((res:AttachmentFiles) => {
      return this.file$.first()
      .map((file: any) => {
        file = file.concat(res);
        return file;
      });
    });
    
    let deleteFromFile$ = this.deleteFromFile$
    .switchMap((deleteFiles) =>
      this.file$.first()
      .map((files: any) =>
        files.filter((el: any) => el.id !== deleteFiles.id)
      )
    );
    
    this.file$ = Observable.merge(
      this.loadFile$,
      this.updateFile$,
      addFileToFile$,
      deleteFromFile$
    ).publishReplay(1).refCount();
    this.file$.subscribe(res => {
      this.newInventory.attachments = res;
    });
  }
  // upload by input type=file
  changeListener($event): void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    
    myReader.onloadend = (e) => {
      this.onImgDrop(myReader.result);
    };
    myReader.readAsDataURL(file);
    this.productImg$.next(file);
  }
  
  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  
  onImgDrop(imgBase64: string): void {
    let img = new Image();
    img.onload = () => {
      let resizedImg: any = this.fileUploadService.resizeImage(img, {resizeMaxHeight: 250, resizeMaxWidth: 250});
      let orientation = this.fileUploadService.getOrientation(imgBase64);
      let orientedImg = this.fileUploadService.getOrientedImageByOrientation(resizedImg, orientation);
      
      this.zone.run(() => {
        this.uploadedImage = orientedImg;
      });
    };
    img.src = imgBase64;
  }
  onMSDCFileUpload(event) {
    this.onMsdsDrop(event.target.files[0]);
    }
  onMsdsDrop(msds: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = msds.name;
    this.addMsds(msds);
  }
  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }
  
  onAttachmentUpload(event) {
    this.onFileDrop(event.target.files[0]);
  }
  
  addFile(file) {
    this.addFileToFile$.next([file]);
  }
  addMsds(msds) {
    this.addMsdsToMsds$.next([msds]);
  }
  
  removeFile(file) {
    this.deleteFromFile$.next(file);
  }
  removeMsds(msds) {
    this.deleteFromMsds$.next(msds);
  }
  
  getType(mime){
    return mime.split('/')[0];
  }
  
  onSearchTextUpdated(searchText){
    this.searchText = searchText;
    this.typeIn$.next(searchText);
  }
  
  onUpcUpdated(upc) {
    this.newProductData.upc = upc;
  }
  
  editProduct(productItem) {
    this.addCustomProduct = true;
    this.editCustomProduct = true;
    this.innerPack = productItem.sub_package.properties.unit_type;
    this.outerPack = productItem.package_type;
    if (productItem.custom_product) {
      this.newProductData = productItem;
      this.newProductData.vendor.vendor_name = productItem.vendors[0].vendor_name;
    }
    else {
      this.newProductData = new InventorySearchResults();
      this.newProductData.consumable_unit.properties.unit_type = productItem.consumable_unit.properties.unit_type;
    }
  }
  
}
