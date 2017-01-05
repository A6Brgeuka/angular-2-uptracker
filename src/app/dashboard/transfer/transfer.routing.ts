import { TransferComponent } from './transfer.component';

export const TransferRoutes = [
  {
    path: 'transfers',
    component: TransferComponent,
    canActivate: [],
  }
  // {
  //   path: '',
  //   redirectTo: 'orders'
  // }
];