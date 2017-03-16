import { VendorsComponent } from './vendors.component';

import { CurrencyCollectionResolve } from '../../shared/resolves/index'
import { ViewVendorRoutes } from './view-vendor/view-vendor.routing';

export const VendorsRoutes = [
  {
    path: 'vendors',
    component: VendorsComponent,
    resolve: {
      CurrencyCollectionResolve
    },
    canActivate: []
  },
  ...ViewVendorRoutes
];