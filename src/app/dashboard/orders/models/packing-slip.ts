export interface PackingSlip {
  date: any;
  id: string;
  item_count: number;
  location_id?: string;
  location_name?: string;
  packing_slip_number?: string;
  received_by?: string;
  status: string;
  status_int?: number;
  vendor_id?: string;
  vendor_name: string;
}
