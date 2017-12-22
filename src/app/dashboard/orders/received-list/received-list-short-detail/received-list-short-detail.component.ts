import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import { PastOrderService } from '../../../../core/services/pastOrder.service';
import { ToasterService } from '../../../../core/services/toaster.service';

@Component({
  selector: 'app-received-list-detail',
  templateUrl: './received-list-short-detail.component.html',
  styleUrls: ['./received-list-short-detail.component.scss']
})
@DestroySubscribers()
export class ReceivedListShortDetailComponent {
  public subscribers: any = {};
  public reorderReceivedProduct$: any = new Subject();
  
  @Input("item") public item: any = [];
  @Input("visible") public visible;
  @Output() public isAllCheckedChanged = new EventEmitter();
  
  constructor(
    public pastOrderService: PastOrderService,
    public toasterService: ToasterService,
  ) {

  }
  
  addSubscribers() {
    this.subscribers.reorderProductSubscription = this.reorderReceivedProduct$
    .switchMap((data) => this.pastOrderService.reorder(data))
    .subscribe(res => this.toasterService.pop('', res.msg))
  }
  
  toggleVariantVisibility(variant) {
    variant.status = variant.status == 2 ? variant.status =1 : variant.status = 2;
  }
  
  setCheckbox(event) {
    const filteredCheckedProducts:any[]  = _.filter(this.item.items, 'checked');
    this.item.checked = filteredCheckedProducts.length === this.item.items.length;
    this.isAllCheckedChanged.emit(this.item.checked);
  }
  
  buyAgainReceivedProduct(product) {
    let data = {
      "orders": [{
        "order_id": product.order_id,
        "items_ids":[product.item_id],
      }]
    };
    this.reorderReceivedProduct$.next(data);
  }
  
}
