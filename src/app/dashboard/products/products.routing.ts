import { ProductsComponent } from './products.component';

// import { CurrencyCollectionResolve } from '../../shared/resolves/index'

export const ProductsRoutes = [
  {
    path: 'products',
    component: ProductsComponent,
    resolve: {
      // CurrencyCollectionResolve
    },
    canActivate: []
  },
];