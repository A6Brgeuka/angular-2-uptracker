import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService, AccountService } from '../../../core/services/index';
import { InventoryService } from '../../../core/services/inventory.service';
import { InventorySearchResults, NewInventoryPackage, searchData } from '../../../models/inventory.model';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { ToasterService } from '../../../core/services/toaster.service';
import { debug } from 'util';

export class AddInventoryModalContext extends BSModalContext {
  inventoryItems: any[] = [];
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
  
  public addCustomProduct: boolean = false;
  
  public saveAdded$: any = new Subject<any>();
  
  public newInventoryPackage: any = new NewInventoryPackage;
  
  public outerPackageList: any[] = this.inventoryService.outerPackageList;
  public innerPackageList: any[] = this.inventoryService.innerPackageList;
  public consumablePackageList: any[] = this.inventoryService.consumablePackageList;
  
  public packageType$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public resultItems$: Observable<any>;
  
  constructor(
    public dialog: DialogRef<AddInventoryModalContext>,
    public userService: UserService,
    public accountService: AccountService,
    public inventoryService: InventoryService,
    public toasterService: ToasterService
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
    });
  
    this.saveAdded$
    .switchMap(() => {
      debugger;
      return this.items$
      .switchMap(items => this.inventoryService.addItemsToInventory(items, this.newInventoryPackage))
    })
    .subscribe(newInventory => {
        this.dismissModal()
      }
    )
  }
  
  onSearchTypeIn(event) {
    this.typeIn$.next(event.target.value);
  }
  
  ngOnInit() {
    
    if (!this.inventoryService.outerPackageList.length) {
      this.getPackagesLists();
    }
    
    let addItemsToItems$ = this.addItemsToItems$
    .switchMap((itemsToCheck: any[]) =>
      this.inventoryService.checkIfNotExist(itemsToCheck)
      .let(this.checkExistedProduct(itemsToCheck))
    )
    .switchMap((newItems: any[]) =>
      this.items$.first()
      .map((items: any) => [...items,...newItems])
    );
    
    let deleteFromItems$ = this.deleteFromItems$
    .switchMap((deleteItems) =>
      this.items$.first()
      .map((items: any) =>
        items.filter((el: any) => el.variant_id !== deleteItems.variant_id)
      )
    );
    
    this.items$ = Observable.merge(
      this.loadItems$,
      addItemsToItems$,
      deleteFromItems$
    ).publishReplay(1).refCount();
    
    this.items$.subscribe(res => {
     
      if(res.length) {
        
        this.outerPackageList = [res[0].package_type];
        this.innerPackageList = [res[0].sub_package.properties.unit_type];
        this.consumablePackageList = [res[0].consumable_unit.properties.unit_type];
        
        this.checkPackage(res[0].package_type);
        this.checkSubPackage(res[0].sub_package.properties.unit_type);
        this.checkConsPackage(res[0].consumable_unit.properties.unit_type);
      }
      if(!res.length) {
        
        this.outerPackageList = this.inventoryService.outerPackageList;
        this.innerPackageList = this.inventoryService.innerPackageList;
        this.consumablePackageList = this.inventoryService.consumablePackageList;

        this.checkPackage(null);
        this.checkSubPackage(null);
        this.checkConsPackage(null);
      }
      this.items = res;
    });

    // load initial items from context
    this.loadItems$.next(this.context.inventoryItems);
    
    this.resultItems$ = Observable.combineLatest(this.packageType$, this.searchResults$)
    .map(([packageType,searchResults]: any) => {
      
      let filteredResults = _.filter(searchResults,packageType);
      
      let checkedResults = searchResults.reduce((acc: any[], item) => {
        let foundedItem = _.find(
          filteredResults,
          { vendor_variant_id: item.vendor_variant_id, product_id: item.product_id}
        );
        return [...acc,{
          ...item,
          notActive: !foundedItem
        }]
      },[]);
      
      return checkedResults;
    })
    
  }
  
  ngOnDestroy() {
    this.saveAdded$.unsubscribe();
    //this.items$.unsubscribe();
  }
  
  checkExistedProduct(itemsToCheck) {
    return (source) =>
      source.map(resItems => {
        
        const existedItems: any[] = _.filter(resItems, 'exists');
        
        const notExistedItems: any[] = _.reject(resItems, 'exists');
        
        const newNotExistedItems: any[] = notExistedItems.reduce((acc: any[], {product_id,vendor_variant_id}) => {
          let item = _.find(itemsToCheck,{vendor_variant_id,product_id});
          return item ? [...acc,item] : acc
        },[]);
        
        const newExistedItems: any[] = existedItems.reduce((acc: any[], {product_id,vendor_variant_id}) => {
          let item = _.find(itemsToCheck,{vendor_variant_id,product_id});
          return item ? [...acc,item] : acc
        },[]);
        
        if(newExistedItems.length) {
          newExistedItems.forEach((item: any) => {
            this.toasterService.pop('error', item.name + ' already exists');
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
  
  deleteFromInventory(items: InventorySearchResults[]) {
    items.map((i) => this.deleteFromItems$.next(i));
    this.checkBoxItems = false;
  }
  
  bulkAdd() {
    this.searchResults$
    .take(1)
    .subscribe((items: InventorySearchResults[]) => {
      // get checked
      let checkedItems = items.filter((item: InventorySearchResults) => item.checked);
      this.addToInventory(checkedItems);
    });
  }
  
  bulkDelete() {
    // get checked
    let checkedItems = this.items.filter((item: InventorySearchResults) => item.checked);
    this.deleteFromInventory(checkedItems);
  }
  
  toggleCustomAdd() {
    this.addCustomProduct = !this.addCustomProduct;
  }
  
  addNewProduct() {
    debugger;
    this.addToInventory([
      new InventorySearchResults(
        Object.assign(this.newProductData, {variant_id: 'tmp' + Math.floor(Math.random() * 1000000)})
      )
    ]);
    this.toggleCustomAdd();
  }
  
  selectAllCandidates() {
    console.log(this.checkBoxCandidates);
    this.searchResults$.next(
      this.searchResults.map((item: InventorySearchResults) => {
        item.checked = this.checkBoxCandidates;
        return item;
      })
    );
  }
  
  selectAllItems() {
    this.loadItems$.next(
      this.items.map((item: InventorySearchResults) => {
        item.checked = this.checkBoxItems;
        return item;
      })
    );
  }
  
  saveAdded(){
    this.saveAdded$.next();
  }
  
  getPackagesLists() {
    this.inventoryService.getPackagesLists().subscribe(res => {
      debugger;
    });
  };
  
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
    this.newInventoryPackage.package_type = e;
    this.nextPackage(this.newInventoryPackage);
  }

  checkSubPackage(e) {
    this.newInventoryPackage.sub_package_type = e;
    this.nextPackage(this.newInventoryPackage);
  }

  checkConsPackage(e) {
    this.newInventoryPackage.consumable_unit_type = e;
    this.nextPackage(this.newInventoryPackage);
  }
  
}
