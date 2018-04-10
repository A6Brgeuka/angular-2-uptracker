import { AllOrdersListService } from './all-orders-list.service';
import { BackorderedOrdersListService } from './backordered-orders-list.service';
import { ClosedOrdersListService } from './closed-orders-list.service';
import { FavoritedOrdersListService } from './favorited-orders-list.service';
import { FlaggedOrdersListService } from './flagged-orders-list.service';
import { OpenOrdersListService } from './open-orders-list.service';
import { OrdersTableService } from './orders-table.service';
import { ReceivedOrdersListService } from './received-orders-list.service';
import { ReconciledOrdersListService } from './reconciled-orders-list.service';

export const ORDERS_PROVIDERS = [
  OrdersTableService,
  AllOrdersListService,
  BackorderedOrdersListService,
  ClosedOrdersListService,
  FavoritedOrdersListService,
  FlaggedOrdersListService,
  OpenOrdersListService,
  ReceivedOrdersListService,
  ReconciledOrdersListService,
];
