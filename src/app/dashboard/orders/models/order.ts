import { OrderItem } from './order-item';

export interface Order {
  item_count: number;
  location_name: string;
  order_id: string;
  order_items?: OrderItem[];
  order_number: string;
  placed_date: any;
  quantity: number;
  received_date?: any;
  reconciled_date?: any;
  status: string;
  status_int: number;
  total: string;
  vendor_id: string;
  vendor_name: string;
}
