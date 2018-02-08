import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ReceiveFormModel {
  invoice_number?: string;
  packing_slip_number?: string;
  orders: any[];
  vendor: {vendor_name: string, vendor_id: string};
}

export class ReceiveFormGroup extends FormGroup {

  constructor({ orders, vendor }: ReceiveFormModel) {
    super({
      invoice_number: new FormControl(),
      packing_slip_number: new FormControl('', Validators.required),
      vendor: new FormGroup({
        vendor_id: new FormControl(vendor.vendor_id, Validators.required),
        vendor_name: new FormControl(vendor.vendor_name, Validators.required),
      })
    });
  }
}
