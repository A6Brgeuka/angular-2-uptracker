import { AllOrdersListService } from './all-orders-list.service';
import { OpenOrdersListService } from './open-orders-list.service';
import { ReceivedOrdersListService } from './received-orders-list.service';

export const ORDERS_PROVIDERS = [
  AllOrdersListService,
  OpenOrdersListService,
  ReceivedOrdersListService,
];
