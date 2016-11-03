import { OrdersComponent } from './orders.component';

export const OrdersRoutes = [
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [],
  },
  {
    path: '',
    redirectTo: 'orders'
  }
];