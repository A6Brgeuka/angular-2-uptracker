import { ShoppingListComponent } from './shopping-list.component';

import { CurrencyCollectionResolve } from '../../shared/resolves/index'

export const ShoppingListRoutes = [
  {
    path: 'shoppinglist',
    component: ShoppingListComponent,
    resolve: {
      CurrencyCollectionResolve
    },
    canActivate: []
  },
];