import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../core/services/account.service';
import { DialogRef } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

export class AddNewProductModalContext extends BSModalContext {

}

@Component({
  selector: 'app-add-new-product-modal',
  templateUrl: './add-new-product-modal.component.html',
  styleUrls: ['add-new-product-modal.component.scss']
})
@DestroySubscribers()
export class AddNewProductModalComponent implements OnInit {
  public subscribers: any = {};

  public product: any = {};
  public step: number = 0;
  public departmentCollection$: Observable<any> = new Observable<any>();
  public departmentCollection: any[];
  public productAccountingCollection$: Observable<any> = new Observable<any>();
  public productAccountingCollection: any[];
  public productCategoriesCollection$: Observable<any> = new Observable<any>();
  public productCategoriesCollection: any[];

  constructor(
    private accountService: AccountService,
    public dialog: DialogRef<AddNewProductModalContext>
  ) {

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
      .subscribe(products => this.productAccountingCollection = products);

    this.subscribers.productCategoriesCollection = this.productCategoriesCollection$
      .subscribe(productsCat => this.productCategoriesCollection = productsCat);
  }

  nextStep() {
    this.step++;
  }

  checkStep(step) {
    return this.step == step;
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  uploadLogo(file: any) {
    const reader = new FileReader();
    reader.onload = ($event: any) => this.product.image = $event.target.result;
    reader.readAsDataURL(file.target.files[0]);
  }
}
