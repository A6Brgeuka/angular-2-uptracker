import { OrdersComponent } from './orders.component';
import { ReceiveRoutes } from './receive/receive.routing';
import { OrderRoutes } from './order/order.routing';
import { ReconcileRoutes } from './reconcile/reconcile.routing';
import { OrderItemsTableRoutes } from './order-items-table/order-items-table.routing';
import { OrdersTableRoutes } from './orders-table/orders-table.routing';
import { PackingSlipsTableRoutes } from './packing-slips-table/packing-slips-table.routing';
import { InvoicesTableRoutes } from './invoices-table/invoices-table.routing';

export const OrdersRoutes = [
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [],
    children: [
      ...OrdersTableRoutes,
      ...OrderItemsTableRoutes,
      ...PackingSlipsTableRoutes,
      ...InvoicesTableRoutes,
    ],
  },
  ...ReceiveRoutes,
  ...ReconcileRoutes,
  ...OrderRoutes,
];
