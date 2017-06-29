import { InventoryComponent } from './inventory.component';
import { InventoryItemRoutes } from './inventory-item/inventory-item.routing';

export const InventoryRoutes = [
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [],
  },
  ...InventoryItemRoutes
];