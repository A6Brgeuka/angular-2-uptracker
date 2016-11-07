import { VendorsComponent } from './vendors.component';

import { CurrencyCollectionResolve } from '../../shared/resolves/index'

export const VendorsRoutes = [
  {
    path: 'vendors',
    component: VendorsComponent,
    resolve: {
      CurrencyCollectionResolve
    },
    canActivate: []
  },
];