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
  status?: string;
  inventory_group_name?: string;
  location_name?: string;
  storage_location_name?: string;
}

export class OrderItemStatusFormGroup extends FormGroup {

  constructor(
    { type,
      qty,
      primary_status = false,
      location_id,
      storage_location_id,
      status,
      inventory_group_name,
      location_name,
      storage_location_name,
    }: OrderItemStatusFormModel
  ) {
    super({
      type: new FormControl(type, Validators.required),
      qty: new FormControl(qty, Validators.required),
      primary_status: new FormControl(primary_status, Validators.required),
      location_id: new FormControl(location_id, Validators.required),
      storage_location_id: new FormControl(storage_location_id, Validators.required),
      status: new FormControl(status),
      inventory_group_name: new FormControl(inventory_group_name),
      location_name: new FormControl(location_name),
      storage_location_name: new FormControl(storage_location_name),
    });
  }
}
