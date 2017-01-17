import { ProductsComponent } from './products.component';

import { CurrencyCollectionResolve } from '../../shared/resolves/index'
import { ProductCollectionResolve } from "../../shared/resolves/main-resolve.service";

export const ProductsRoutes = [
  {
    path: 'products',
    component: ProductsComponent,
    resolve: {
      CurrencyCollectionResolve,
      // productCollection: ProductCollectionResolve,

    },
    canActivate: []
  },
];