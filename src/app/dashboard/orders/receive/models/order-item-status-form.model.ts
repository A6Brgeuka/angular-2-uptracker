import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface OrderReceivingStatus {
  value: string;
  text: string;
}

export interface OrderItemStatusFormModel {
  type: string;
  qty: number;
  primary_status: boolean;
  location_id: string;
  storage_location_id: string;
}

export class OrderItemStatusFormGroup extends FormGroup {

  constructor({ type, qty,  primary_status, location_id, storage_location_id }: OrderItemStatusFormModel) {
    super({
      type: new FormControl('', Validators.required),
      qty: new FormControl('', Validators.required),
      primary_status: new FormControl(false, Validators.required),
      location_id: new FormControl('', Validators.required),
      storage_location_id: new FormControl('', Validators.required),
    });
  }
}
