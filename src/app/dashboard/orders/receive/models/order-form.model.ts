import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface OrderFormModel {
  order_id: string;
  items: any;
}

export class OrderFormGroup extends FormGroup {

  constructor({ order_id, items }: OrderFormModel) {
    super({
      order_id: new FormControl(order_id, Validators.required),
    });
  }
}
