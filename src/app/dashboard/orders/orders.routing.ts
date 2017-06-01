import { OrdersComponent } from './orders.component';
import { ReceiveRoutes } from './receive/receive.routing';

export const OrdersRoutes = [
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [],
  },
  ...ReceiveRoutes
];