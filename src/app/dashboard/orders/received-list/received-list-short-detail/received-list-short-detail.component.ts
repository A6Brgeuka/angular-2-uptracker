import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

@Component({
  selector: 'app-received-list-detail',
  templateUrl: './received-list-short-detail.component.html',
  styleUrls: ['./received-list-short-detail.component.scss']
})
@DestroySubscribers()
export class ReceivedListShortDetailComponent {
  public subscribers: any = {};
  
  @Input("item") public item: any = [];
  @Input("visible") public visible;
  @Output() public isAllCheckedChanged = new EventEmitter();
  
  constructor(

  ) {

  }

  toggleVariantVisibility(variant) {
    variant.status = variant.status == 2 ? variant.status =1 : variant.status = 2;
  }
  
  setCheckbox(event) {
    const filteredCheckedProducts:any[]  = _.filter(this.item.items, 'checked');
    this.item.checked = filteredCheckedProducts.length === this.item.items.length;
    this.isAllCheckedChanged.emit(this.item.checked);
  }
  
  
  buyAgainProduct(product) {
  
  }
}
