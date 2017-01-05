import { InventoryComponent } from './inventory.component';

export const InventoryRoutes = [
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [],
  }
  // {
  //   path: '',
  //   redirectTo: 'orders'
  // }
];