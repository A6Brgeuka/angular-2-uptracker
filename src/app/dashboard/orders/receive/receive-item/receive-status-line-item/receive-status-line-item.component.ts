import { Component, Input } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { OrderItemStatusFormGroup } from '../../models/order-item-status-form.model';

@Component({
  selector: 'app-receive-status-line-item',
  templateUrl: './receive-status-line-item.component.html',
})
@DestroySubscribers()

export class ReceiveStatusLineItemComponent {
  public removed = false;

  @Input() public statusFormGroup: OrderItemStatusFormGroup;

  @Input() public inventoryGroupId: string;

  get status(): string {
    return this.getControlValue('status');
  }

  get qty(): string {
    return this.getControlValue('qty');
  }

  get inventory_group_name(): string {
    return this.getControlValue('inventory_group_name');
  }

  get location_name(): string {
    return this.getControlValue('location_name');
  }

  get storage_location_name(): string {
    return this.getControlValue('storage_location_name');
  }

  removePreviouslyReceivedToggle() {
    this.removed = !this.removed;
  }

  private getControlValue(controlName: string) {
    const control = this.statusFormGroup.get(controlName);
    return control && control.value;
  }
}
