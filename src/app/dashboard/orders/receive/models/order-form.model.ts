import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderItemFormGroup, OrderItemFormModel } from './order-item-form.model';

export interface OrderFormModel {
  order_id: string;
  items: OrderItemFormModel[];
}

export class OrderFormGroup extends FormGroup {

  constructor({ order_id, items }: OrderFormModel) {
    const itemsGroups = items.map((item) => new OrderItemFormGroup(item));
    super({
      order_id: new FormControl(order_id, Validators.required),
      items: new FormArray(itemsGroups),
    });
  }
}
