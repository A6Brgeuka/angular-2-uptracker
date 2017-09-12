import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { Modal } from 'angular2-modal';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Location }                 from '@angular/common';
import { UserService, AccountService } from '../../../core/services/index';
import { ModalWindowService } from "../../../core/services/modal-window.service";
import { ToasterService } from "../../../core/services/toaster.service";
import { EditCommentModal } from "../../../shared/modals/edit-comment-modal/edit-comment-modal.component";
import { ActivatedRoute, Params } from '@angular/router';
import { ConfigService } from '../../../core/services/config.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { InfoModal } from './default-info-modal/info-modal-component';
import { AddInventoryModal } from '../add-inventory/add-inventory-modal.component';

@Component({
  selector: 'app-inventory-item-modal',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
@DestroySubscribers()
export class InventoryItemComponent implements OnInit, AfterViewInit {
  public subscribers: any = {};
  public product: any;
  public productCopy: any;
  public variation: any = {
  
  };
  public variationArrs = {
    package_type: [],
    unit_type: [],
    units_per_package: [],
    size: [],
    material: [],
    price_range: []
  };
  public currentVariant: any = {};
  public showVariant: boolean = false;
  public comment: any = {};
  public showEdit: boolean = false;
  public hasDocs: boolean = false;
  public hasFiles: boolean = false;
  public addOrderVariantsButtonShow: boolean = false;
  public departmentCollection: string[];
  public productAccountingCollection: string[];
  public productCategoriesCollection: string[];
  public variants = [{}];
  public variants$: BehaviorSubject<any> = new BehaviorSubject([]);
  public orders$: BehaviorSubject<any> = new BehaviorSubject([]);
  public showEdit$: BehaviorSubject<any> = new BehaviorSubject([]);
  public filterSelectOption$: BehaviorSubject<any> = new BehaviorSubject({});
  public filterName$: BehaviorSubject<any> = new BehaviorSubject(null);
  public filterPrice$ = new BehaviorSubject(null);
  public filteredVariants$ = Observable.of([]);
  public variantsCopy = [];
  public variantChecked$ = new BehaviorSubject(false);
  public comments$ = new BehaviorSubject([]);
  public addToComments$ = new Subject();
  public deleteFromComments$ = new Subject();
  public editCommentComments$ = new Subject();
  public filteredComments$;
  public location_id;
  public currentLocation: any = {};
  
  fileIsOver: boolean = false;
  public file$: Observable<any>;
  public file;
  public loadFile$: Subject<any> = new Subject<any>();
  public addFileToFile$: Subject<any> = new Subject<any>();
  public deleteFromFile$: Subject<any> = new Subject<any>();
  public updateFile$: Subject<any> = new Subject<any>();
  public canEdit:boolean = false;
  public doc$: Observable<any>;
  public doc;
  public loadDoc$: Subject<any> = new Subject<any>();
  public addDocToDoc$: Subject<any> = new Subject<any>();
  public deleteFromDoc$: Subject<any> = new Subject<any>();
  public updateDoc$: Subject<any> = new Subject<any>();
  public hasInfoTab: boolean = false;
  public inventory_id: string;
  public favorite: boolean;
  public locationArr: any;
  public product$: any = new BehaviorSubject<any>(null);
  public updateFavorite$: any = new Subject();
  public deleteInventory$: any = new Subject();
  
  constructor(
    public userService: UserService,
    public accountService: AccountService,
    public configService: ConfigService,
    public InventoryService: InventoryService,
    public toasterService: ToasterService,
    public location: Location,
    public route: ActivatedRoute,
    public zone: NgZone,
    public modalWindowService: ModalWindowService,
    public modal: Modal
  ) {
    this.fileActions();
    this.docActions();
    this.showEdit$.next(false);
  }
  
  ngOnInit() {
    
    this.loadFile$.next([]);
    
    let addToComments$ = this.addToComments$.switchMap((item: any) => {
      return this.comments$.first().map(collection => {
        collection.unshift(item);
        return collection;
      })
    });
    
    let deleteFromComments$ = this.deleteFromComments$.switchMap((id: any) => {
      return this.comments$.first().map(collection => {
        _.remove(collection, {id: id});
        return collection;
      })
    });
    
    let editCommentComments$ = this.editCommentComments$.switchMap((commentToUpdate: any) => {
      return this.comments$.first().map(collection => {
        return collection.map((comment: any) => {
          if (comment.id == commentToUpdate.id) {
            return commentToUpdate
          }
          return comment;
        });
      })
    });
    
    this.filteredComments$ = Observable.merge(
      this.comments$,
      addToComments$,
      deleteFromComments$,
      editCommentComments$
    ).map(comments => {
      let filteredComments = _.map(comments, (item: any) => {
        if (item.body) {
          let regKey = new RegExp('(?:\r\n|\r|\n)', 'g');
          item.body = item.body.replace(regKey, "<br/>"); // adding many lines comment
        }
        
        if (item.created_at) {
          let date = new Date(item.created_at);
          item.created_at = date.toDateString();
        }
        
        return item;
      });
      return _.orderBy(filteredComments, (item: any) => {
        return new Date(item.created_at)
      }, ['desc'])
    });
    
    this.filteredVariants$ = Observable.combineLatest(
      this.variants$,
      this.filterSelectOption$,
      this.filterName$,
      this.filterPrice$,
      this.variantChecked$,
      this.showEdit$,
    )
    .map(([variants, filterSelectOption, filterName, filterPrice, variantChecked, showEdit]) => {
      if (showEdit) {
        return variants;
      }
      // check if at least on variant is checked to show add order button
      let checkedArrVariants = _.filter(variants, {checked: true});
      
      this.variation.checked = checkedArrVariants.length == variants.length && variants.length ? true : false;
      
      this.addOrderVariantsButtonShow = checkedArrVariants.length ? true : false;
      
      if (filterPrice && filterPrice != "") {
        variants = _.reject(variants, (variant: any) => {
          let key = new RegExp(filterPrice, 'i');
          return !key.test(variant.name);
        });
      }
      if (filterName && filterName != "") {
        variants = _.reject(variants, (variant: any) => {
          let key = new RegExp(filterName, 'i');
          return !key.test(variant.name);
        });
      }
      variants = _.filter(variants, filterSelectOption);
      return variants;
    });
    
  }
  
  addSubscribers() {
    
    this.getCurrentInventory();
  
    this.subscribers.selectLocationSubscription = Observable.combineLatest(this.accountService.dashboardLocation$, this.product$)
    .filter(([location, product]:any) => {
      return (location && product)
    })
    .switchMap(([location, product]:any) => {
      return product.inventory_item_locations.map(inventoryLocation => {
        if(location.id === inventoryLocation.location_id) {
          product.critical_level = inventoryLocation.critical_level;
          product.overstock_level = inventoryLocation.overstock_level;
          product.fully_stocked = inventoryLocation.fully_stocked;
          product.on_hand = inventoryLocation.on_hand;
          product.storage_locations = inventoryLocation.storage_locations;
        }
      })
    }).subscribe();
  
    this.subscribers.environmentSubscription = this.configService.environment$
    .filter((a:string)=>a=='development')
    .subscribe((a)=> {
      this.canEdit = true;
    });
  
    this.subscribers.locationSubscription = this.accountService.locations$
    .subscribe(r => {
      this.locationArr = r
    });
    
    this.subscribers.updateFavouriteSubscription = this.updateFavorite$
    .switchMap(() => {
      let inventory = {
        inventory_id: this.inventory_id,
        favorite: this.favorite
      };
      return this.InventoryService.setFavorite(inventory)})
    .subscribe(res => {
        this.InventoryService.updateInventoryItem(res);
        this.getCurrentInventory();
        this.toasterService.pop('', res.favorite ? 'Added to favorites' : "Removed from favorites");
      },
      err => console.log('error')
    );
  
    this.subscribers.deleteInventorySubscription = this.deleteInventory$
    .switchMap(() => {return this.product$ })
    .switchMap(inventory => this.InventoryService.deleteInventory(inventory))
    .subscribe(res =>
        this.goBack()
      ,
      err => console.log('error')
    );
  }
  
  getCurrentInventory() {
    this.subscribers.getInventorySubscription = this.route.params
    .switchMap((p:Params)=>this.InventoryService.getInventoryItem(p['id']))
    .subscribe((a:any)=> {
      this.inventory_id = a.id;
      this.favorite = a.favorite;
      this.product$.next(a);
      //this.comments$.next(a.comments); // update comments
    });
  }
  
  changeSelected(loc_id, var_id) {
    this.currentLocation[var_id] = loc_id;
  }
  
  showEditFields() {
    if (this.canEdit) {
      this.showEdit = true;
      this.productCopy = _.clone(this.product);
      this.variants$.take(1).subscribe(r => {
        this.variantsCopy = _.cloneDeep(r);
      });
      this.showEdit$.next(true);
    }
  }
  
  closeEditFields() {
    this.showEdit = false;
    this.showEdit$.next(false);
    this.productCopy = [];
    this.variants$.next(this.variantsCopy);
  }
  
  resetText() {
    this.product.hazardous_string = this.product.hazardous ? 'Yes' : 'No';
    this.product.trackable_string = this.product.trackable ? 'Yes' : 'No';
    this.product.tax_exempt_string = this.product.tax_exempt ? 'Yes' : 'No';
    this.product.account_category = this.product.account_category ? this.product.account_category : 'Not Specified';
  }
  
  // File load, add, delete actions
  fileActions(): any {
    let addFileToFile$ = this.addFileToFile$
    .switchMap((res) => {
      return this.file$.first()
      .map((file: any) => {
        file = file.concat(res);
        return file;
      });
    });
    let deleteFromFile$ = this.deleteFromFile$
    .switchMap((deleteFile) => {
      this.file$.subscribe((res) => {
        console.log('Model Service delete from file ' + res);
      });
      return this.file$.first()
      .map((file: any) => {
        return file.filter((el: any) => {
          return el.name != deleteFile.name;
        });
      });
    });
    this.file$ = Observable.merge(
      this.loadFile$,
      this.updateFile$,
      addFileToFile$,
      deleteFromFile$
    ).publishReplay(1).refCount();
    this.file$.subscribe(res => {
      this.file = res;
      this.hasFiles = res.length > 0;
    });
  }
  
  // Doc load, add, delete actions
  docActions(): any {
    let addDocToDoc$ = this.addDocToDoc$
    .switchMap((res) => {
      return this.doc$.first()
      .map((doc: any) => {
        doc = doc.concat(res);
        return doc;
      });
    });
    let deleteFromDoc$ = this.deleteFromDoc$
    .switchMap((deleteDoc) => {
      this.doc$.subscribe((res) => {
        console.log('Model Service delete from doc ' + res);
      });
      return this.doc$.first()
      .map((doc: any) => {
        return doc.filter((el: any) => {
          return el.file_name != deleteDoc.file_name;
        });
      });
    });
    this.doc$ = Observable.merge(
      this.loadDoc$,
      this.updateDoc$,
      addDocToDoc$,
      deleteFromDoc$
    )
    .publishReplay(1)
    .refCount();
    
    this.doc$
    .subscribe(res => {
      console.log('docs', res);
      this.doc = res;
      this.hasDocs = res.length > 0;
    });
  }
  
  ngAfterViewInit() {
    this.filterSelectOption$.next({status: 1});
  }
  
  dismissModal() {
    this.InventoryService.getNextInventory(this.InventoryService.current_page, '', '');
  }
  
  closeModal(data) {
  }
  
  checkFilterValue(event) {
    if (event.target.value.length) {
      return event.target.value;
    }
  }
  
  // make all variant checkboxes value to be head checkbox value
  headCheckboxChange() {
    this.variants$.next(_.map(this.variants$.getValue(), (variant: any) => {
      variant.checked = this.variation.checked;
      return variant;
    }));
  }
  
  // detects changes on variant checkbox
  variantCheckedChange() {
    this.variantChecked$.next(false)
  }
  
  changeName(event) {
    this.filterName$.next(event.target.value.trim())
  }
  
  changePrice(event) {
    this.filterPrice$.next(event.target.value.trim())
  }
  
  changeSize(event) {
    if (this.checkFilterValue(event)) {
      this.variation.size = event.target.value;
    }
    else {
      delete this.variation.size
    }
    this.filterSelectOption$.next(this.variation)
  }
  
  changeMaterial(event) {
    if (this.checkFilterValue(event)) {
      this.variation.material = event.target.value;
    }
    else {
      delete this.variation.material
    }
    this.filterSelectOption$.next(this.variation)
  }
  
  toggleVariationVisibility() {
    this.variation.status = this.variation.status == 2 ? this.variation.status = 1 : this.variation.status = 2;
    this.filterSelectOption$.next(this.variation);
  }
  
  toggleVariantVisibility(variant) {
    variant.status = variant.status == 2 ? variant.status = 1 : variant.status = 2;
  }
  
  toggleVariantDetailView(variant) {
    variant.detailView = !variant.detailView;
  }
  
  sendComment() {
    Object.assign(this.comment,
      {
        "user_id": this.userService.selfData.id,
        "object_type": "inventory_item",
        "object_id": this.inventory_id
      }
    );
    this.subscribers.addInventoryItemSubscriber = this.InventoryService.addInventoryItemComment(this.comment)
    .subscribe(res => {
      //this.comment = {};
      this.addToComments$.next(res);
    });
  }
  
  editComment(comment) {
    let clonedComment = _.cloneDeep(comment);
    if (clonedComment.body) {
      let regKey = new RegExp('<br/>', 'g');
      clonedComment['body'] = clonedComment.body.replace(regKey, "\r\n"); // replacing <br/> many lines comment
    }
    this.modal
    .open(EditCommentModal, this.modalWindowService.overlayConfigFactoryWithParams({comment: clonedComment}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (comment) => {
          this.subscribers.editInventoryItemComment = this.InventoryService.editInventoryItemComment(comment).subscribe(res => {
            this.editCommentComments$.next(res.data);
          })
        },
        (err) => {
        }
      );
    });
  }
  deleteComment(comment) {
    this.modalWindowService.confirmModal('Delete Comment?', 'Are you sure you want to delete this comment?', this.deleteCommentFunc.bind(this, comment.id));
  }
  
  deleteCommentFunc(id) {
    this.subscribers.deleteProductSubscriber = this.InventoryService.deleteInventoryItemComment(id)
    .subscribe(res => {
    
    })
  }
  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  
  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }
  
  onFileUpload(event) {
    this.onFileDrop(event.target.files[0]);
  }
  
  addFile(file) {
    this.addFileToFile$.next([file]);
  }
  
  removeFile(file, index) {
    console.log(`remove ${file.name}`);
    this.deleteFromFile$.next(file);
  }
  
  removeDoc(doc, index) {
    console.log(`remove ${doc.file_name}`);
    this.deleteFromDoc$.next(doc);
  }
  
  reformatOrderHistory(ina: any): any {
    let out: any = [];
    _.map(ina, vnt =>
      _.map(vnt['inventory'], inv =>
        _.map(inv['orders'], ord => {
            ord['variant_name'] = vnt['name'];
            ord['variant_id'] = vnt['id'];
            out.push(ord);
          }
        )
      )
    )
    return out;
  }
  
  goBack(): void {
    if (this.showVariant) {
      this.showVariant = false;
      this.currentVariant = {};
    } else {
      this.location.back();
    }
  }
  
  hideVariantDetails() {
    
  }
  
  defaultInfoModal() {
    this.modal
    .open(InfoModal, this.modalWindowService
    .overlayConfigFactoryWithParams({"text": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea c'}, true, 'mid'))
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
  
  setFavorite(e) {
    e.stopPropagation();
    this.updateFavorite$.next();
  }
  
  deleteInventory() {
    this.modalWindowService.confirmModal('Delete inventory?', 'Are you sure you want to delete the inventory?', this.deleteInventoryFunc.bind(this));
  }
  
  deleteInventoryFunc() {
    this.deleteInventory$.next();
  }
  
  openAddInventoryModal(){
    this.product$
    .take(1)
    .subscribe((inventory)=>{
    let data = {
      inventoryGroup:inventory
    };
    this.modal
    .open(AddInventoryModal, this.modalWindowService.overlayConfigFactoryWithParams({'inventoryGroup': data, 'inventoryItems':[]}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
        },
        (err) => {
        }
      );
    });
    });
  }
  
}
