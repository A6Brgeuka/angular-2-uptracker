import { AllOrdersListService } from './all-orders-list.service';
import { OpenOrdersListService } from './open-orders-list.service';
import { ReceivedOrdersListService } from './received-orders-list.service';
import { OrdersTableService } from './orders-table.service';

export const ORDERS_PROVIDERS = [
  OrdersTableService,
  AllOrdersListService,
  OpenOrdersListService,
  ReceivedOrdersListService,
];
