import { ShoppingListComponent } from './shopping-list.component';

import { CurrencyCollectionResolve } from '../../shared/resolves/index'
import { OrdersPreviewRoutes } from './orders-preview/orders-preview.routing';

export const ShoppingListRoutes = [
  {
    path: 'shoppinglist',
    component: ShoppingListComponent,
    resolve: {
      CurrencyCollectionResolve
    },
    children: [
    ],
    canActivate: []
  },
];