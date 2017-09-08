import { ReceiveComponent } from './receive.component';
import { StatusListResolve } from '../../../shared/resolves/main-resolve.service';

export const ReceiveRoutes = [
  {
    path: 'orders/receive',
    component: ReceiveComponent,
    resolve: {
      statusList: StatusListResolve,
    },
  }
];