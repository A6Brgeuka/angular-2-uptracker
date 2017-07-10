import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, ViewContainerRef } from '@angular/core';

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
  public product_id: string;
  public locationArr: any;
  public product$: Subject<any> = new Subject<any>();
  
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
    this.route.params
    .switchMap((p:Params)=>this.InventoryService.getInventoryItem(p['id']))
    .subscribe((a)=> {
      this.product$.next(a);
    });
  
    this.configService.environment$
    .filter((a:string)=>a=='development')
    .subscribe((a)=> {
      this.canEdit = true;
    });
  
    this.accountService.locations$
    .subscribe(r => {
      this.locationArr = r
    });
    
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
      //
      return variants;
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
        "object_type": "products",
        "object_id": this.product.id
      }
    );
    //this.subscribers.addInventoryItemSubscriber = this.InventoryService.addInventoryItemComment(this.comment).subscribe(res => {
    //  this.comment = {};
    //  this.addToComments$.next(res.data);
    //});
  }
  
  editComment(comment) {
    let clonedComment = _.cloneDeep(comment);
    if (clonedComment.body) {
      let regKey = new RegExp('<br/>', 'g');
      clonedComment['body'] = clonedComment.body.replace(regKey, "\r\n"); // replacing <br/> many lines comment
    }
    //this.modal
    //.open(EditCommentModal, this.modalWindowService.overlayConfigFactoryWithParams({comment: clonedComment}))
    //.then((resultPromise) => {
    //  resultPromise.result.then(
    //    (comment) => {
    //      this.subscribers.editInventoryItemComment = this.InventoryService.editInventoryItemComment(comment).subscribe(res => {
    //        this.editCommentComments$.next(res.data);
    //      })
    //    },
    //    (err) => {
    //    }
    //  );
    //});
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
  
}
