import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import { VendorModel } from '../../models';
import { UserService, AccountService } from '../../core/services';
import * as _ from 'lodash';


export class TransferModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'transfer-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss']
})
@DestroySubscribers()
export class TransferModal implements OnInit, ModalComponent<TransferModalContext> {
  public context: TransferModalContext;
  public subscribers: any = {};
  public searchText: string = '';
  public modalState: number = 0;
  public location: string = '';
  public productVariant: string = '';
  public groups: Array<any> = [];
  public selectedGroup: any;
  public inventories: Array<any> = [];
  public activeInventory: any = {};

  constructor(
    public dialog: DialogRef<TransferModalContext>,
    public userService: UserService,
    public accountService: AccountService,
  ) {
    this.context = dialog.context;
    this.groups = [{
      name: 'Gloves Tender Touch Nitrile',
      info: 'Gloves Tender Touch Nitrile Sempercare PF 200/box',
      counts: 13,
      min: 5,
      max: 30,
      on_hand: 15,
      critical_level: 10,
      overstock_level: 25,
    }];
    this.inventories = [{
      stockName: 'Mini Fridge',
      stockQTY: 30,
      stockDisabled: false,
      floorName: 'Front Desk',
      floorQTY: 2,
      floorQTYTemp: 2,
      floorLimit: 2,
      floorVisible: false,
    }, {
      stockName: 'Shelf A',
      stockQTY: 133,
      stockDisabled: false,
      floorName: 'Ex. Room 1',
      floorQTY: 0,
      floorQTYTemp: 0,
      floorLimit: 0,
      floorVisible: false,
    }, {
      stockName: 'Sterlization Room',
      stockQTY: 2,
      stockDisabled: false,
      floorName: 'Ex. Room 2',
      floorQTY: 10,
      floorQTYTemp: 10,
      floorLimit: 10,
      floorVisible: false,
    }];
  }

  ngOnInit() {}

  goBackToFirst() {
    this.modalState = 0;
  }

  locationSort(event) {
    this.inventories.forEach((inventory) => {
      inventory.stockQTY = Math.round(100 * Math.random());
    });
  }

  productSort(event) {
    this.inventories.forEach((inventory) => {
      inventory.stockQTY = Math.round(100 * Math.random());
    });
  }

  transferSort(event) {
    this.inventories.forEach((inventory) => {
      inventory.floorQTY = Math.round(100 * Math.random());
      inventory.floorQTYTemp = inventory.floorQTY;
      inventory.floorLimit = inventory.floorQTY;
    });
  }

  searchProducts(event) {}

  floorClick(event, index) {
    if (this.activeInventory.stockQTY - event > -1) {
      this.activeInventory.stockQTY -= event;
      this.inventories[index].floorQTY += event;
      this.inventories[index].floorQTYTemp = this.inventories[index].floorQTY;
    }
  }

  floorChange(event, index) {
    if (event < this.inventories[index].floorLimit || event - this.inventories[index].floorQTYTemp > this.activeInventory.stockQTY) {
      setTimeout(() => {
        this.inventories[index].floorQTY = this.inventories[index].floorQTYTemp;
      })
    } else {
      this.inventories[index].floorQTY = event;
      this.activeInventory.stockQTY -= (event - this.inventories[index].floorQTYTemp);
      this.inventories[index].floorQTYTemp = event;
    }
  }

  stockClick(index) {
    this.inventories.forEach((inventory, idx) => {
      if (index == idx) {
        inventory.stockDisabled = false;
      } else {
        inventory.stockDisabled = true;
      }
      inventory.floorVisible = true;
    })
    this.activeInventory = this.inventories[index];
  }

  toBackInitial() {
    this.modalState = 0;
    this.searchText = '';
  }

  toGoModal(state, index) {
    this.modalState = state;
    if (index !== undefined) {
      this.selectedGroup = this.groups[index];
    }
  }

  // sets the style of the range-field thumb;
  calcQuantityMargin(product) {
    let valueArr: number[] = [product.on_hand, product.critical_level, product.overstock_level];

    product.max = Math.max(...valueArr);
    product.min = Math.min(...valueArr);

    let quantityMargin = ((product.on_hand - product.critical_level) * 100 / (product.overstock_level - product.critical_level)).toString();
    let thumbColor = this.calcThumbColor(product.on_hand / product.overstock_level );

    let defaultLeft = {'left': '0', 'right': 'inherit'};
    let defaultRight = {'left': 'inherit', 'right': '0'};

    if (product.critical_level == null || product.overstock_level == null) {
      return { 'left': 'calc(50% - 10px)', 'background-color' : thumbColor };
    } else if (product.on_hand < product.critical_level) {
      let criticalMargin = ((product.critical_level - product.on_hand) * 100 / (product.overstock_level - product.on_hand)).toString();
      product.criticalLevel = this.checkOverlaps(criticalMargin, product);
      product.overstockLevel = defaultRight;
      return { 'left': '-18px', 'background-color' : 'red' };
    } else if (product.on_hand === product.critical_level) {
      product.criticalLevel = defaultLeft;
      product.overstockLevel = defaultRight;
      return { 'left': '-15px', 'background-color' : 'red' };
    } else if (product.on_hand > product.overstock_level) {
      let overStockMargin = ((product.overstock_level - product.critical_level) * 100 / (product.on_hand - product.critical_level)).toString();
      product.overstockLevel = this.checkOverlaps(overStockMargin, product);
      product.criticalLevel = defaultLeft;
      return { 'right': '-15px', 'background-color' : thumbColor };
    } else {
      product.criticalLevel = defaultLeft;
      product.overstockLevel = defaultRight;
      return this.checkOverlaps(quantityMargin, product, thumbColor);
    }
  }

  private calcThumbColor(number: number) {
    let value = Math.min(Math.max(0, number), 1) * 510;
    let redValue;
    let greenValue;
    if (value < 255) {
      redValue = 255;
      greenValue = Math.sqrt(value) * 16;
      greenValue = Math.round(greenValue);
    } else {
      greenValue = 255;
      value = value - 255;
      redValue = 255 - (value * value / 255);
      redValue = Math.round(redValue);
    }
    return this.rgb2hex(redValue*.9,greenValue*.9,0);
  }

  private checkOverlaps(margin, product, thumbColor = '#fff') {
    if (Number(margin) < 12 && product.on_hand < product.critical_level) {
      return { 'left': 'calc(12% - 5px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) > 88 && product.on_hand > product.overstock_level) {
      return { 'left': 'calc(88% - 25px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) > 88 && product.on_hand !== product.overstock_level) {
      return { 'left': 'calc(88% - 18px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) < 12) {
      return { 'left': 'calc(12% - 15px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else {
      return { 'left': `calc(${margin}% - 10px)`, 'background-color' : thumbColor, 'right': 'inherit' };
    }
  }

  private rgb2hex(red, green, blue) {
    let rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
