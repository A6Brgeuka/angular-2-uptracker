import { ProductsComponent } from './products.component';

import { CurrencyCollectionResolve } from '../../shared/resolves/index'
import {
  ProductCollectionResolve,
  ProductAccountingCollectionResolve, ProductCategoriesCollectionResolve, DepartmentCollectionResolve
} from "../../shared/resolves/main-resolve.service";

export const ProductsRoutes = [
  {
    path: 'products',
    component: ProductsComponent,
    resolve: {
      CurrencyCollectionResolve,
      ProductAccountingCollectionResolve,
      ProductCategoriesCollectionResolve,
      DepartmentCollectionResolve
      // productCollection: ProductCollectionResolve,
    },
    canActivate: []
  },
];