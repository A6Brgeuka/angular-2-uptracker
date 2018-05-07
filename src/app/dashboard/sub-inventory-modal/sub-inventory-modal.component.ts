import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import { VendorModel } from '../../models';
import { UserService, AccountService, SubtractService } from '../../core/services';


export class SubInventoryModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'sub-inventory-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './sub-inventory-modal.component.html',
  styleUrls: ['./sub-inventory-modal.component.scss']
})
@DestroySubscribers()
export class SubInventoryModal implements OnInit, ModalComponent<SubInventoryModalContext> {
  public context: SubInventoryModalContext;
  public subscribers: any = {};
  public searchText: string = '';
  public modalState: number = 0;
  public location: string = '';
  public subtracting: string = 'Box';
  public groups: Array<any> = [];
  public selectedGroup: any;

  public stockMini: number = 30;
  public stockMiniLimit: number = 30;
  public stockShelf: number = 133;
  public stockShelfLimit: number = 133;
  public stockSterlization: number = 2;
  public stockSterlizationLimit: number = 2;

  public inventories: Array<any> = [];
  public inventory: any = {}
  public productVariant: any = {}
  public inventoryBy: any = []

  constructor(
    public dialog: DialogRef<SubInventoryModalContext>,
    public userService: UserService,
    public accountService: AccountService,
    public subtractService: SubtractService,
  ) {
    this.context = dialog.context;
    this.groups.push({
      name: 'Gloves Tender Touch Nitrile',
      info: 'Gloves Tender Touch Nitrile Sempercare PF 200/box',
      counts: 13,
      min: 5,
      max: 30,
      on_hand: 15,
      critical_level: 10,
      overstock_level: 25,
    });
  }

  ngOnInit() {
    this.subtractService.getInventory('5aec73b36427bb00088997bb').subscribe(res => {
      console.log('Inventory: ', res)
      this.inventory = res;
    })
  }

  searchProducts(event) {
    this.subtractService.searchInventory(this.searchText, 10, 1).subscribe(res => {
      this.inventories = res;
    });
  }

  goBackToFirst() {
    this.modalState = 0;
  }

  productChange(event) {
    this.inventory.inventory_products.forEach(product => {
      if (product.id == this.productVariant) {
        this.inventoryBy = product.inventory_by;
      }
    })
  }

  locationSort(event) {
    this.stockMini = Math.round(100 * Math.random());
    this.stockMiniLimit = this.stockMini;
    this.stockShelf = Math.round(100 * Math.random());
    this.stockShelfLimit = this.stockShelf;
    this.stockSterlization = Math.round(100 * Math.random());
    this.stockSterlizationLimit = this.stockSterlization;
  }

  subtractingSort(event) {}

  stockMiniClick(value) {
    if (value === this.stockMini && value > this.stockMiniLimit) {
      setTimeout(() => {
        this.stockMini = this.stockMiniLimit;
      })
    } else if (value !== this.stockMini) {
      this.stockMini += value;
    }
  }

  stockShelfClick(value) {
    if (value === this.stockShelf && value > this.stockShelfLimit) {
      setTimeout(() => {
        this.stockShelf = this.stockShelfLimit;
      })
    } else if (value !== this.stockShelf) {
      this.stockShelf += value;
    }
  }

  stockSterlizationClick(value) {
    if (value === this.stockSterlization && value > this.stockSterlizationLimit) {
      setTimeout(() => {
        this.stockSterlization = this.stockSterlizationLimit;
      })
    } else if (value !== this.stockSterlization) {
      this.stockSterlization += value;
    }
  }

  toBackInitial() {
    this.modalState = 0;
    this.searchText = '';
  }

  toGoModal(state, index) {
    this.modalState = state;
    if (index !== undefined) {
      this.inventory = this.inventories[index];
      this.inventory.critical_level = 10;
      this.inventory.overstock_level = 30;
      this.inventory.min = 0;
      this.inventory.max = 40;
    }
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
