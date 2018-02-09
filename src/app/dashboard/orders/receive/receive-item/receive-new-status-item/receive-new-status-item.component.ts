import { Component, Input, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { OrderItemStatusFormGroup } from '../../models/order-item-status-form.model';
import { ReceivedOrderService } from '../../../../../core/services/received-order.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-receive-new-status-item',
  templateUrl: './receive-new-status-item.component.html',
})
@DestroySubscribers()

export class ReceiveNewStatusItemComponent implements OnInit {

  public statusList: any = this.receivedOrderService.statusList;

  @Input() public statusFormGroup: OrderItemStatusFormGroup;

  constructor(
    public receivedOrderService: ReceivedOrderService,
  ) {

  }

  ngOnInit() {

  }

  get typeControl() {
    return this.statusFormGroup.get('type');
  }

  get qtyControl() {
    return this.statusFormGroup.get('qty');
  }

}
