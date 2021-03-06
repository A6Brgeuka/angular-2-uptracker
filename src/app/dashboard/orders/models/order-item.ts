export interface OrderItem {
  account_id: string;
  approval_user?: any;
  approved_date?: any;
  backordered_date?: any;
  backordered_qty?: number;
  backordered_total?: string;
  catalog_number?: any;
  created_at: string;
  denied_date?: any;
  discounted: boolean;
  favorite: boolean;
  flagged: boolean;
  flagged_comment?: string;
  id: string;
  item_description?: string;
  item_name: string;
  line_item_type: string;
  location: string;
  location_id: string;
  location_name: string;
  order_id: string;
  order_method: string;
  order_number: string;
  package_price: string;
  placed_date: string;
  po_number: string;
  po_reconciled_date?: any;
  po_status: string;
  po_status_int: number;
  price: number;
  product_count: number;
  product_id: string;
  qty: number;
  quantity: number;
  received_date?: string;
  received_quantity?: number;
  reconciled_by?: any;
  reconciled_date?: any;
  reconciled_quantity?: any;
  requires_approval?: any;
  status: string;
  status_int: number;
  status_line_items: any[];
  reconciled_price?: any;
  sub_total: string;
  total: string;
  unit_price: string;
  updated_at: string;
  variant_id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_variant_id?: string;
}
