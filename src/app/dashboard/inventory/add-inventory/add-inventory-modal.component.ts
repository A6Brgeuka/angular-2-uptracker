import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { UserService, AccountService } from '../../../core/services/index';
import { InventoryService } from '../../../core/services/inventory.service';
import {
  AttachmentFiles, InventorySearchResults,
  searchData
} from '../../../models/inventory.model';
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
  
  public addCustomProduct: boolean = false;
  
  public saveAdded$: any = new Subject<any>();
  
  public newInventory: any = new InventoryModel;
  
  public outerPackageList: any[];
  public innerPackageList: any[];
  public consumablePackageList: any[];
  
  public packageType$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public resultItems$: Observable<any>;
  public checkedProduct$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public checkedProduct: any[] = [];
  public matchingProductDisabled: boolean = false;
  public matchingAll$: BehaviorSubject<any> = new BehaviorSubject<any>(false);
  
  public showSelect: boolean = true;
  public autocompleteProducts: any =  [];
  public autocompleteProducts$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  
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
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  
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
      
      if(this.items.length) {
        this.checkedProduct =[];
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
        
        this.checkedProduct =[];
        this.packageType$.next({});
        this.outerPackageList = this.inventoryService.outerPackageList;
        this.innerPackageList = this.inventoryService.innerPackageList;
        this.consumablePackageList = this.inventoryService.consumablePackageList;

        this.checkPackage(null);
        this.checkSubPackage(null);
        this.checkConsPackage(null);
      }
        this.checkedProduct$.next({})
    });
    
    this.saveAdded$
    .switchMap(() => {
      return this.items$
      .switchMap(items => {
        this.newInventory.products.map((product) => {
          if(product.product_id === null) {
            product.variant_id = null
          }
        })
        return this.inventoryService.addItemsToInventory(this.newInventory)})
    })
    .subscribe(newInventory => {
        this.dismissModal()
      }
    );
    
    this.autocompleteProducts$
    .debounceTime(10)
    .switchMap((keywords:string) => this.inventoryService.autocompleteSearch(keywords))
    .subscribe(res => {
      this.autocompleteProducts = res['suggestions'];
    });
    
    this.fileActions();
    this.msdsActions();
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
    this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
  
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
  observableSource(keyword: any) {
    return Observable.of(this.autocompleteProducts)
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
      addItemsToItems$,
      addCustomItemToItems$,
      deleteFromItems$
    ).publishReplay(1).refCount();
    
    this.items$.subscribe(res => {
      this.newInventory.products = res.map((el:any) => new InventoryProductModel(el));
      this.showSelect = false;
      if(res.length) {
        this.newInventory.name = res[0].name;
        this.outerPackageList = [res[0].package_type];
        this.innerPackageList = [res[0].sub_package.properties.unit_type];
        this.consumablePackageList = [res[0].consumable_unit.properties.unit_type];
        this.newInventory.sub_package_qty = [res[0].sub_package.properties.qty];
        this.newInventory.consumable_unit_qty = [res[0].consumable_unit.properties.qty];
        
        this.checkPackage(res[0].package_type);
        this.checkSubPackage(res[0].sub_package.properties.unit_type);
        this.checkConsPackage(res[0].consumable_unit.properties.unit_type);
      }
      if(!res.length) {
        this.newInventory.sub_package_qty = null;
        this.newInventory.consumable_unit_qty = null;
      }
      if(!res.length && !this.checkedProduct.length) {
        
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

    // load initial items from context
    this.loadItems$.next(this.context.inventoryItems);
    
    this.resultItems$ = Observable.combineLatest(this.packageType$, this.searchResults$, this.checkedProduct$, this.matchingAll$)
    .map(([packageType,searchResults,checkedProduct,matchingAll]: any) => {
      let filteredResults = _.filter(searchResults,packageType);
      
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
          }
          else {
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
  
  ngOnDestroy() {
    this.saveAdded$.unsubscribe();
    this.productImg$.unsubscribe();
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
        sub_package: {properties: {unit_type: item.consumable_unit.properties.unit_type}},
        consumable_unit: {properties: {unit_type: item.consumable_unit.properties.unit_type}}
      };
  
      this.outerPackageList = [item.package_type];
      this.innerPackageList = [item.consumable_unit.properties.unit_type];
      this.consumablePackageList = [item.consumable_unit.properties.unit_type];
  
      this.checkPackage(item.package_type);
      this.checkSubPackage(item.consumable_unit.properties.unit_type);
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
    setTimeout(()=>{ this.showSelect = true
    },0.6);
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
  
  toggleCustomCancel() {
    this.addCustomProduct = !this.addCustomProduct;
    if(!this.items.length) {
      this.nextPackage({});
    }
  }
  
  addNewProduct() {
    this.addCustomToInventory([
      new InventorySearchResults(
        Object.assign(this.newProductData, {
          variant_id: 'tmp' + Math.floor(Math.random() * 1000000),
          vendors:[{vendor_name:this.newProductData.vendor_name, vendor_id:null}]
        })
      )
    ]);
    console.log(this.newProductData);
    this.toggleCustomAdd();
  }
  
  saveAdded(){
    this.saveAdded$.next();
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
    this.newInventory.sub_package_type = e;
    this.newProductData.sub_package.properties.unit_type = e;
    this.nextPackage(this.newInventory);
  }

  checkConsPackage(e) {
    this.newInventory.consumable_unit_type = e;
    this.newProductData.consumable_unit.properties.unit_type = e;
    this.nextPackage(this.newInventory);
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
  
  changeTrackingMethod(location, tracking_method) {
    location.tracking_method = tracking_method;
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
      console.log('files',res);
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
      console.log('files',res);
      this.newInventory.attachments = res;
      //this.hasFiles = res.length > 0;
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
