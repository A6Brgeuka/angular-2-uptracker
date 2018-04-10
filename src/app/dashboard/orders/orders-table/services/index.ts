import { AllOrdersListService } from './all-orders-list.service';
import { BackorderedOrdersListService } from './backordered-orders-list.service';
import { OpenOrdersListService } from './open-orders-list.service';
import { OrdersTableService } from './orders-table.service';
import { ReceivedOrdersListService } from './received-orders-list.service';

export const ORDERS_PROVIDERS = [
  OrdersTableService,
  AllOrdersListService,
  BackorderedOrdersListService,
  OpenOrdersListService,
  ReceivedOrdersListService,
];
