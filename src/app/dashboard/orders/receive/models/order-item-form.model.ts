import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface OrderItemFormModel {
  item_id: string;
  status: any[];
  inventory_group_id: string;
}

export class OrderItemFormGroup extends FormGroup {

  constructor({ item_id, inventory_group_id, }: OrderItemFormModel) {
    super({
      item_id: new FormControl(item_id, Validators.required),
      inventory_group_id: new FormControl(inventory_group_id, Validators.required),
    });
  }
}
