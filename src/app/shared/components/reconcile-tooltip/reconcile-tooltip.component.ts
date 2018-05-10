import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'reconcile-tooltip',
  templateUrl: './reconcile-tooltip.component.html',
  styleUrls: ['./reconcile-tooltip.component.scss'],
})

export class ReconcileTooltipComponent {
  public _isLower: any = {};
  public state: number = 10;
  public reconcileType: string = '';

  @Input()
  set isLower(value: any) {
    console.log('~~~~~~~~~~~~~~~:   ', value)
    this._isLower = value;
  }

  constructor() {
    if (this._isLower == 'true') {
      this.state = 10;
    } else {
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

    }
  }
}
