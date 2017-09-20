import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService, AccountService } from '../../../core/services/index';
import { InventoryService } from '../../../core/services/inventory.service';
import { AttachmentFiles, InventorySearchResults, searchData } from '../../../models/inventory.model';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { ToasterService } from '../../../core/services/toaster.service';
import { debug } from 'util';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FileUploadService } from '../../../core/services/file-upload.service';
import { InventoryLocationModel, InventoryModel, InventoryProductModel, InventoryStorageLocationModel } from '../../../models/create-inventory.model';

export class AddInventoryModalContext extends BSModalContext {
  inventoryItems: any[] = [];
  inventoryGroup: any = null;
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
  
  public addCustomProduct: boolean = false;
  
  public saveAdded$: any = new Subject<any>();
  public updateAdded$: any = new Subject<any>();

  public newInventory: any = new InventoryModel;
  
  public outerPackageList: any[];
  public innerPackageList: any[];
  public consumablePackageList: any[];
  public classDirty: boolean = false;
  
  public packageType$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public resultItems$: Observable<any>;
  public checkedProduct$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public checkedProduct: any[] = [];
  public matchingProductDisabled: boolean = false;
  public matchingAll$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  
  public showSelect: boolean = true;
  public autocompleteProducts: any =  [];
  public autocompleteProducts$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteVendors$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public autocompleteVendors: any = [];
  public vendorDirty: boolean = false;
  public vendorValid: boolean = false;
  
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
  
  public departmentCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection: any;
  
  @ViewChild('step1') step1: ElementRef;
  @ViewChild('step2') step2: ElementRef;
  @ViewChild('step3') step3: ElementRef;
  @ViewChild('step4') step4: ElementRef;
  
  public locations$: Observable<any> = this.accountService.locations$;
  public locations: any[];
  
  constructor(
    public zone: NgZone,
    public dialog: DialogRef<AddInventoryModalContext>,
    public userService: UserService,
    public accountService: AccountService,
    public inventoryService: InventoryService,
    public toasterService: ToasterService,
    public fileUploadService: FileUploadService,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    
    this.typeIn$
    .debounceTime(500)
    .switchMap((key: string) => this.inventoryService.search(key))
    .subscribe((data: searchData) => {
      this.total = data.count;
      this.searchResults$.next(data.results);
      this.searchResults = data.results;
      console.log(this.searchResults);
      if (this.items.length) {
        this.checkedProduct = [];
        this.outerPackageList = [this.items[0].package_type];
        this.innerPackageList = [this.items[0].sub_package.properties.unit_type];
        this.consumablePackageList = [this.items[0].consumable_unit.properties.unit_type];
        this.newInventory.sub_package_qty = [this.items[0].sub_package.properties.qty];
        this.newInventory.consumable_unit_qty = [this.items[0].consumable_unit.properties.qty];
        this.checkPackage(this.items[0].package_type);
        this.checkSubPackage(this.items[0].sub_package.properties.unit_type);
        this.checkConsPackage(this.items[0].consumable_unit.properties.unit_type);
      }
      if (!this.items.length && this.checkedProduct.length) {
        this.checkedProduct = [];
        this.packageType$.next({});
        this.outerPackageList = this.inventoryService.outerPackageList;
        this.innerPackageList = this.inventoryService.innerPackageList;
        this.consumablePackageList = this.inventoryService.consumablePackageList;

        this.checkPackage(null);
        this.checkSubPackage(null);
        this.checkConsPackage(null);
      }
        this.checkedProduct$.next({});
    });
    
    this.saveAdded$
    .switchMap(() => {
      return this.items$
      .switchMap(items => {
        this.newInventory.products.map((product) => {
          if (product.product_id === null) {
            product.variant_id = null;
            // product.vendor_name = product.vendors[0].vendor_name;
            // product.vendor_id = product.vendors[0].vendor_id;
          }
        });
        return this.inventoryService.addItemsToInventory(this.newInventory)});
    })
    .subscribe(newInventory => this.dismissModal());

      this.updateAdded$
          .switchMap(() => {
              return this.inventoryService.updateInventory(this.newInventory)
          })
          .subscribe(newInventory => this.dismissModal());

    this.autocompleteProducts$
    .switchMap((keywords: string) => this.inventoryService.autocompleteSearch(keywords)).publishReplay(1).refCount()
    .subscribe(res => {
      this.autocompleteProducts = res['suggestions'];
    });

    this.subscribers.autocompleteVendorsSubscription = this.autocompleteVendors$
    .switchMap((key: string) => this.inventoryService.autocompleteSearchVendor(key)).publishReplay(1).refCount()
    .subscribe((res:any) => {
      this.autocompleteVendors = res;
    });
    
    this.fileActions();
    this.msdsActions();
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.subscribers.getProductCategoriesSubscription = this.accountService.getProductCategories().take(1).subscribe(res => this.productCategoriesCollection = res);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
  
    this.outerPackageList = this.inventoryService.outerPackageList;
    this.innerPackageList = this.inventoryService.innerPackageList;
    this.consumablePackageList = this.inventoryService.consumablePackageList;
  }
  
  onSearchTypeIn(event) {
      this.autocompleteProducts$.next(event.target.value);
      this.typeIn$.next(event.target.value);
  }
  selectedAutocompled(keyword) {
    this.typeIn$.next(keyword);
  }
  selectedAutocompledVendor(vendor) {
    this.newProductData.vendors = [vendor];
  }
  observableSource(keyword: any) {
    return Observable.of(this.autocompleteProducts).take(1);
  }
  
  onSearchVendor(event) {
    this.newProductData.vendor_name = event.target.value;
    this.vendorDirty = true;
    this.vendorValid = !!(event.target.value);
    this.autocompleteVendors$.next(event.target.value);
  }
  
  observableSourceVendor(keyword: any) {
    return Observable.of(this.autocompleteVendors).take(1);
  }
  vendorListFormatter(data:any) {
      return 'vendor_name';
  }
  
  ngOnInit() {
    
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
      .map((items: any) =>
        items.filter((el: any) => el.variant_id !== deleteItems.variant_id)
      )
    );
    
    let addCustomItemToItems$ = this.addCustomItemToItems$.switchMap((customItem) =>
      this.items$.first().map((items:any) => {
        items =_.concat(items, [customItem[0]]);
        return items;
      })
    );
    
    this.items$ = Observable.merge(
      this.loadItems$,
      this.editAddItemToItems$,
      addItemsToItems$,
      addCustomItemToItems$,
      deleteFromItems$
    ).publishReplay(1).refCount();
    
    this.items$.subscribe(res => {
      this.newInventory.products = res.map((el: any) => new InventoryProductModel(el));
      this.showSelect = false;
      if (res.length) {
        
        let searchedCategory = (res[0].category) ? this.productCategoriesCollection.indexOf(res[0].category) : null;
        
        this.newInventory.name = res[0].name;
        this.newInventory.inventory_by_array = res[0].inventory_by;
        this.newInventory.department = (res[0].department) ? res[0].department : this.newInventory.department;
        this.newInventory.category = (searchedCategory !== -1) ? res[0].category : null;
        this.newInventory.description = (res[0].description) ? res[0].description : this.newInventory.description;
        this.outerPackageList = [res[0].package_type];
        this.innerPackageList = [res[0].sub_package.properties.unit_type];
        this.consumablePackageList = [res[0].consumable_unit.properties.unit_type];
        this.newInventory.sub_package_qty = [res[0].sub_package.properties.qty];
        this.newInventory.consumable_unit_qty = [res[0].consumable_unit.properties.qty];
        
        this.checkPackage(res[0].package_type);
        this.checkSubPackage(res[0].sub_package.properties.unit_type);
        this.checkConsPackage(res[0].consumable_unit.properties.unit_type);
      }
      if (!res.length) {
        this.newInventory.sub_package_qty = null;
        this.newInventory.consumable_unit_qty = null;
      }
      if (!res.length && !this.checkedProduct.length) {
        
        this.outerPackageList = this.inventoryService.outerPackageList;
        this.innerPackageList = this.inventoryService.innerPackageList;
        this.consumablePackageList = this.inventoryService.consumablePackageList;

        this.checkPackage(null);
        this.checkSubPackage(null);
        this.checkConsPackage(null);
      }
      setTimeout(()=>{ this.showSelect = true;
      },0.6);
      console.log(res);
      this.items = res;
    });

     //load initial items from context
    this.loadItems$.next(this.context.inventoryItems);
    if (this.context.inventoryGroup) {
      let editedItems = this.context.inventoryGroup.inventoryGroup.inventory_products.map(product => {
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
      this.newInventory.products.map(item => {
        item.selectedVendor = {vendor_name: item.vendor_name, vendor_id: item.vendor_id};
        this.compareVendor(item.selectedVendor, item.selectedVendor);
      });
      console.log(this.context.inventoryGroup.inventoryGroup);
      console.log(this.newInventory);
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
    
  }
  
  ngOnDestroy() {
    this.saveAdded$.unsubscribe();
    this.productImg$.unsubscribe();
    this.updateAdded$.unsubscribe();
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
        package_type: item.package_type,
        sub_package: {properties: {unit_type: item.sub_package.properties.unit_type}},
        consumable_unit: {properties: {unit_type: item.consumable_unit.properties.unit_type}}
      };
  
      this.outerPackageList = [item.package_type];
      this.innerPackageList = [item.sub_package.properties.unit_type];
      this.consumablePackageList = [item.consumable_unit.properties.unit_type];
  
      this.checkPackage(item.package_type);
      this.checkSubPackage(item.sub_package.properties.unit_type);
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
    
    this.matchingProductDisabled = (this.checkedProduct.length) ? true : false;
    
    if (!item.checked) {
      this.checkBoxCandidates = false;
    }
    
    if(!this.checkedProduct.length && !this.items.length) {
      
      this.outerPackageList = this.inventoryService.outerPackageList;
      this.innerPackageList = this.inventoryService.innerPackageList;
      this.consumablePackageList = this.inventoryService.consumablePackageList;
  
      this.checkPackage(null);
      this.checkSubPackage(null);
      this.checkConsPackage(null);
      this.packageType$.next({});
    }
    setTimeout(() => { this.showSelect = true },0.6);
  }
  
  selectAllCandidates() {
    this.matchingProductDisabled = this.checkBoxCandidates ? true : false;
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
      // get checked
      const checkedItems = items.filter((item: InventorySearchResults) => item.checked);
      this.addToInventory(checkedItems);
    });
  }
  
  bulkDelete() {
    // get checked
    const checkedItems = this.items.filter((item: InventorySearchResults) => item.checked);
    this.deleteFromInventory(checkedItems);
  }
  
  toggleCustomAdd() {
    this.addCustomProduct = !this.addCustomProduct;
  }
  
  toggleCustomCancel() {
    this.addCustomProduct = !this.addCustomProduct;
    if (!this.items.length) {
      this.nextPackage({});
    }
  }
  
  addNewProduct() {
    let vendor = (this.newProductData.vendors[0].vendor_name) ? this.newProductData.vendors : [{vendor_name: this.newProductData.vendor_name, vendor_id:null}];
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
          inventory_by: inventory_by_arr
        })
      )
    ]);
    this.newProductData.upc = '';
    this.newProductData.catalog_number = '';
    this.newProductData.vendor_name = '';
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
    this.newProductData.price = val;
    this.newProductData.formattedPrice = val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  
  selectPackageType(packageType) {
    this.newInventory.inventory_by = packageType.value;
    this.newInventory.inventory_by_qty = packageType.qty;
    this.newInventory.inventory_by_type = packageType.type;
    this.newInventory.inventory_by_label = packageType.label;
  }
  
  saveAdded() {
    if (this.context.inventoryGroup) {
        this.updateAdded$.next();
    } else {
        this.saveAdded$.next();
    }
  }
  
  nextPackage(value) {
    let formValue = {};
    
    formValue = value.package_type ? {
      ...formValue,
      package_type: value.package_type,
    }: formValue;
  
    formValue = value.sub_package_type ? {
      ...formValue,
      sub_package: {properties: {unit_type: value.sub_package_type}},
    }: formValue;
  
    formValue = value.consumable_unit_type ? {
      ...formValue,
      consumable_unit: {properties: {unit_type: value.consumable_unit_type}}
    }: formValue;
    
    this.packageType$.next(formValue);
  }
  
  checkPackage(e) {
    this.newInventory.package_type = e;
    this.newProductData.package_type = e;
    this.nextPackage(this.newInventory);
  }

  checkSubPackage(e) {
    if(e === '') {
      this.newProductData.sub_package.properties.qty = '';
    }
    this.newInventory.sub_package_type = e;
    this.newProductData.sub_package.properties.unit_type = e;
    this.nextPackage(this.newInventory);
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
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    
    myReader.onloadend = (e) => {
      this.onImgDrop(myReader.result);
    };
    myReader.readAsDataURL(file);
    //TODO send img after click on Save button
    this.productImg$.next(file);
  }
  
  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  
  onImgDrop(imgBase64: string): void {
    var img = new Image();
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
    console.log(`remove ${file.file_name}`);
    this.deleteFromFile$.next(file);
  }
  removeMsds(msds) {
    console.log(`remove ${msds.file_name}`);
    this.deleteFromMsds$.next(msds);
  }
  
  getType(mime){
    return mime.split('/')[0];
  }
  
}
