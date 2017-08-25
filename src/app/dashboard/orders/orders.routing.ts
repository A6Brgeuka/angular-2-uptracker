import { OrdersComponent } from './orders.component';
import { ReceiveRoutes } from './receive/receive.routing';
import { OrderRoutes } from './order/order.routing';
import { StatusListResolve } from '../../shared/resolves/main-resolve.service';

export const OrdersRoutes = [
  {
    path: 'orders',
    component: OrdersComponent,
    resolve: {
      statusList: StatusListResolve,
    },
    canActivate: [],
  },
  ...ReceiveRoutes,
  ...OrderRoutes
];