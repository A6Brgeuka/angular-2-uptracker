import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';

import { ProductModel } from '../../../models/index';
import { UserService, AccountService } from '../../../core/services/index';
import { ProductService } from "../../../core/services/product.service";
import { ModalWindowService } from "../../../core/services/modal-window.service";
import { ToasterService } from "../../../core/services/toaster.service";
import { EditCommentModal } from "../../../shared/modals/edit-comment-modal/edit-comment-modal.component";

export class ViewProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-view-product-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './view-product-modal.component.html',
  styleUrls: ['./view-product-modal.component.scss']
})
@DestroySubscribers()
export class ViewProductModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<ViewProductModalContext> {
  private subscribers: any = {};
  context: ViewProductModalContext;
  private product: any;
  public variation: any = {visibility: true};
  public variationArrs = {
    package_type: [],
    unit_type: [],
    units_per_package: [],
    size: [],
    material: [],
    price_range: []
  };
  public comment: any = {};

  public addOrderVariantsButtonShow: boolean = false;

  public variants = [];
  public variants$: BehaviorSubject<any> = new BehaviorSubject([]);
  public filterSelectOption$: BehaviorSubject<any> = new BehaviorSubject({});
  public filterName$: BehaviorSubject<any> = new BehaviorSubject(null);
  public filterPrice$ = new BehaviorSubject(null);
  public filteredVariants$ = Observable.of([]);
  public variantChecked$ = new BehaviorSubject(false);
  public variantVisibility$ = new BehaviorSubject(false);
  public comments$ = new BehaviorSubject([]);
  public addToComments$ = new Subject();
  public deleteFromComments$ = new Subject();
  public editCommentComments$ = new Subject();
  public filteredComments$;
  public location_id;

  // @ViewChild('secondary') secondaryLocationLink: ElementRef;

  constructor(public dialog: DialogRef<ViewProductModalContext>,
              public userService: UserService,
              public accountService: AccountService,
              public productService: ProductService,
              public modalWindowService: ModalWindowService,
              public toasterService: ToasterService,
              private zone: NgZone,
              private modal: Modal) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    this.product = this.context.product;
    this.product.hazardous_string = this.product.hazardous ? 'Yes' : 'No';
    this.product.trackable_string = this.product.trackable ? 'Yes' : 'No';
    this.product.tax_exempt_string = this.product.tax_exempt ? 'Yes' : 'No';
    this.product.account_category = this.product.account_category ? this.product.account_category : 'Not Specified';
    this.product.comments = [];
    this.location_id = this.product.location_id;

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
    )
      .map(([variants,filterSelectOption,filterName,filterPrice,variantChecked]) => {

        // check if at least on variant is checked to show add order button
        let checkedArrVariants = _.filter(variants, {checked: true});

        this.variation.checked = checkedArrVariants.length == variants.length && variants.length ? true : false;

        this.addOrderVariantsButtonShow =  checkedArrVariants.length ? true : false;

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


    this.subscribers.getProductSubscription = this.productService.getProductLocation(this.product.id, this.location_id)
      .filter(res => res.data)
      .map(res => res.data)
      .subscribe(data => {
        this.variants = _.map(data.variants, (item: any) => {
          item.checked = false;
          item.visibility = true;
          return item;
        });


        this.variants$.next(this.variants); // update variants
        this.comments$.next(data.comments); // update comments


        _.each(this.variants, (variant: any)=> {
          _.forEach(this.variationArrs, (value, key) => {
            this.variationArrs[key].push(this.variationArrs[key].indexOf(variant[key]) >= 0 ? null : variant[key]);
          })
        });
        _.forEach(this.variationArrs, (value, key) => {
          this.variationArrs[key] = _.filter(this.variationArrs[key], res => res);
        });

        //
        // this.product.comments = data.comments || [];
        // this.product.comments.map((item: any) => {
        //   let regKey = new RegExp('\n,\r,\r\n','g');
        //   item.body = item.body.replace(regKey, "<br />");
        //   return item;
        // });
        // this.product.comments = _.orderBy(this.product.comments, (item: any) => { return new Date(item.created_at)},['desc'])

      })
  }

  ngAfterViewInit() {
    // this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
    //   this.chooseTabLocation(res);
    //   if (res && res.id != this.primaryLocation.id){
    //     this.secondaryLocationLink.nativeElement.click();
    //   }
    // });
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
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

  changePkg(event) {
    if (this.checkFilterValue(event)) {
      this.variation.package_type = event.target.value;
    }
    else {
      delete this.variation.package_type
    }
    this.filterSelectOption$.next(this.variation)
  }

  changeUnit(event) {
    if (this.checkFilterValue(event)) {
      this.variation.unit_type = event.target.value;
    }
    else {
      delete this.variation.unit_type
    }
    this.filterSelectOption$.next(this.variation)
  }

  changeUnitsPkg(event) {
    if (this.checkFilterValue(event)) {
      this.variation.units_per_package = parseInt(event.target.value);
    }
    else {
      delete this.variation.units_per_package
    }
    this.filterSelectOption$.next(this.variation)
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
    this.variation.visibility = !this.variation.visibility;
    this.filterSelectOption$.next(this.variation);
  }

  toggleVariantVisibility(variant) {
    variant.visibility = !variant.visibility;
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
    this.subscribers.addProductSubscriber = this.productService.addProductComment(this.comment).subscribe(res => {
      this.comment = {};
      this.addToComments$.next(res.data);
    });

  }

  editComment(comment) {
    let clonedComment = _.cloneDeep(comment);
    if (clonedComment.body) {
      let regKey = new RegExp('<br/>', 'g');
      clonedComment.body = clonedComment.body.replace(regKey, "\r\n"); // replacing <br/> many lines comment
    }
    this.modal
      .open(EditCommentModal, this.modalWindowService.overlayConfigFactoryWithParams({comment: clonedComment}))
      .then((resultPromise)=> {
        resultPromise.result.then(
          (comment) => {
            this.subscribers.editProductComment = this.productService.editProductComment(comment).subscribe(res => {
              this.editCommentComments$.next(res.data);
            })
          },
          (err)=> {
          }
        );
      });
  }

  deleteComment(comment) {
    this.modalWindowService.confirmModal('Delete Comment?', 'Are you sure you want to delete this comment?', this.deleteCommentFunc.bind(this, comment.id));

  }

  deleteCommentFunc(id) {
    this.subscribers.deleteProductSubscriber = this.productService.deleteProductComment(id).subscribe(res => {
      this.deleteFromComments$.next(id);
      this.toasterService.pop("", res.message)
    })
  }

  // editVendor(vendor = null){
  //   if (this.currentLocation) {
  //     this.accountService.dashboardLocation$.next(this.currentLocation);
  //   }
  //   this.closeModal(vendor);
  // }

  // chooseTabLocation(location = null){
  //   if (location && location != this.primaryLocation) {
  //     this.sateliteLocationActive = true;
  //     this.secondaryLocation = location;
  //   } else {
  //     this.sateliteLocationActive = false;
  //   }
  //   this.currentLocation = location;
  //
  //   // fill vendor info for modal view vendor
  //   this.vendor = new VendorModel(this.context.vendor);
  //   if (location){
  //     let locationAccountVendor = _.find(this.accountVendors, {'location_id': this.currentLocation.id});
  //     _.each(locationAccountVendor, (value, key) => {
  //       if (value)
  //           this.vendor[key] = value;
  //     });
  //   }
  // }
}
