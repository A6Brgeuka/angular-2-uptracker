import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'reconcile-tooltip',
  templateUrl: './reconcile-tooltip.component.html',
  styleUrls: ['./reconcile-tooltip.component.scss'],
})

export class ReconcileTooltipComponent {
  public _product: any = {};
  public state: number = 10;
  public reconcileType: string = '';

  @Input()
  set product(value: any) {
    this._product = value;
  }

  constructor() {
    if (this._product.package_price > this._product.reconciled_package_price) {
      this.state = 10;
    } else if (this._product.package_price < this._product.reconciled_package_price) {
      this.state = 12;
    }
  }

  changeTooltip(button) {
    if (button == 'next') {
      if (this.reconcileType == 'discount') {
        this.state = 11;
      } else if (this.reconcileType == 'price') {
        this.state = 12;
      }
    } else if (button == 'yes') {
      this.state = 13;
    } else if (button == 'no') {
      this.state = 14;
    } else {
      this._product.isTooltipVisible = false;
    }
  }
}
