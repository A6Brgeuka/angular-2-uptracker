import { Component, OnInit, Input } from '@angular/core';
import {Modal} from 'angular2-modal';
import {Observable} from 'rxjs/Observable';
import {DestroySubscribers} from 'ngx-destroy-subscribers';
import {ProductModel} from '../../../../models/product.model';
import {ModalWindowService} from '../../../../core/services/modal-window.service';
import {AccountService} from '../../../../core/services/account.service';
import {HelpTextModal} from '../../../inventory/add-inventory/help-text-modal/help-text-modal-component';
import {ProductService} from "../../../../core/services/product.service";
import {each} from 'lodash';

@Component({
  selector: 'app-add-product-from-vendor-step1',
  templateUrl: 'add-product-from-vendor-step1.component.html',
  styleUrls: ['add-product-from-vendor-step1.component.scss']
})

@DestroySubscribers()
export class AddProductFromVendorStep1Component implements OnInit {

  @Input('product') product: any;
  @Input('variants') variants: any;

  public subscribers: any = {};
  public vendor: any = {};
  public vendors: any = [];
  public selectAll: boolean = true;
  public item: any = {};
  public departmentCollection$: Observable<any> = new Observable<any>();
  public departmentCollection: any[];
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection: any[];
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection: any[];
  public logoPreview: any;
  public searchText: any;

  constructor(
    private accountService: AccountService,
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public productService: ProductService) {
  }

  ngOnInit() {
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.productAccountingCollection$ = this.accountService.getProductAccounting().take(1);
    this.productCategoriesCollection$ = this.accountService.getProductCategories().take(1);
  }

  addSubscribers() {
    this.subscribers.departmenCollectiontSubscription = this.departmentCollection$
      .subscribe(departments => this.departmentCollection = departments);

    this.subscribers.productAccountingCollection = this.productAccountingCollection$
      .subscribe(collections => this.productAccountingCollection = collections);

    this.subscribers.productCategoriesCollection = this.productCategoriesCollection$
      .subscribe(productsCat => this.productCategoriesCollection = productsCat);
  }

  openHelperModal() {
    this.modal.open(HelpTextModal, this.modalWindowService
      .overlayConfigFactoryWithParams({'text': ''}, true, 'mid'))
  }

  uploadLogo(file: any) {
    const reader = new FileReader();
    const formData = new FormData();
    reader.onload = ($event: any) => {
      this.logoPreview = $event.target.result;
      formData.append('image', file.target.files[0]);
      this.productService.addCustomProductImage(formData)
        .subscribe(url => this.product.image = url);
    };
    reader.readAsDataURL(file.target.files[0]);
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    let files: File[] = inputValue.files;
    this.addFile(files);
  }

  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }

  addFile(files) {
    const formData = new FormData();
    each(files, (file, i) => formData.append(`documents[${i}]`, file));
    this.productService.addCustomProductDocument(formData)
      .subscribe(urls =>
        this.product.attachments = (this.product.attachments || []).concat(urls));
  }

  select(value) {
    each(this.variants, (v) => {
      v.checked = value;
    });
    this.onVariantChanged();
  }

  removeFile(i) {
    this.product.attachments.splice(i, 1)
  }

  onVariantChanged() {
    this.productService.changeVariants$.next();
  }

}
