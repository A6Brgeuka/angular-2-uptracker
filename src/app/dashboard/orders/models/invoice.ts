export interface Invoice {
  date: any;
  id: string;
  invoice_id: string;
  item_count: number;
  location_id?: string;
  location_name?: string;
  reconciled_by_id: string;
  reconciled_by_name: string;
  status: string;
  total: string;
  vendor: string;
}
