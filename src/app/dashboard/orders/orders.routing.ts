import { OrdersComponent } from './orders.component';
import { ReceiveRoutes } from './receive/receive.routing';
import { OrderRoutes } from './order/order.routing';

export const OrdersRoutes = [
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [],
  },
  ...ReceiveRoutes,
  ...OrderRoutes
];